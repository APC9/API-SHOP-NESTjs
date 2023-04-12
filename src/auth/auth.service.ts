import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity'; 
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {
  // Errores mas especificos con el formato de Nestjs
  private readonly logger = new Logger('ProductsService');
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ){}

  async create(createUserDto: CreateUserDto ) {
    
    try {
      const { password, ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });

      await this.userRepository.save( user )
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto){

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where: { email },       
      select: { email: true, password: true , id: true} // retorna solo email y password
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user credentials');
    }

    if ( !bcrypt.compareSync(password, user.password) ) {
      throw new UnauthorizedException('Invalid user credentials');
    }

    return {
      ...user,
      token: this.getJwtToken({ id: user.id  })
    };
  }

  async checkAuthStatus(data: string){

    const token = data.split(' ')[1];
      
    try {
      const payload = await this.jwtService.verify(token);
      const { id } = payload;

      const user = await this.userRepository.findOne({ 
        where: { id },       
        select: { email: true, password: true , id: true, fullName: true} // retorna solo email y password
      });
      
      return user;

    } catch (error) {
      throw new BadRequestException('Token inválido');
    }
  }

  async checkAuthStatus2( user: User,){
    return{
      ...user,
      token: this.getJwtToken({ id: user.id  })
    }
  }

  private getJwtToken(payload:JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleExceptions(error:any):never {
    //error en consola con el formato de Nestjs
    if ( error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpeced error, check server logs');
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

}
