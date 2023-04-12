import { Controller, Post, Body, Get, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  //Revalidar JWT 
  // Ejemplo 1 tomar solo el JWT de los Headers
  @Get('login')
  @Auth(ValidRoles.admin, ValidRoles.user)
  async checkAuthStatus(@Headers('Authorization') data: string)  {
    return await this.authService.checkAuthStatus(data);
  }

  // Ejemplo 2  tomar todo el usuario
  @Get('check-status')
  @Auth(ValidRoles.admin, ValidRoles.user)
  async checkAuthStatus2( @GetUser() user: User,)  {
    return await this.authService.checkAuthStatus2(user);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(

    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string, 
    @RawHeaders() rawHeaders: string[],

    )
    {
    return{
      ok: true,
      msg: 'testingPrivateRoute',
      user,
      userEmail,
      rawHeaders
    }
  }
  
  //@SetMetadata('roles', ['admin', 'super-user'])
  // @UseGuards( AuthGuard()): el AuthGuard() usa la estretegia de verificacion de JWT que definimos en el archivo
  // strategies jwt.strategy.ts

  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin) // recibe un array de roles y los establece en la metadata
  @UseGuards( AuthGuard(), UserRoleGuard ) // el UserRoleGuard recibe los roles de la metadata y los compara
  privateRoute2(

    @GetUser() user: User

  ) {
    return{
      ok: true,
      user
    }
  }
  
  @Get('private3')
  @Auth(ValidRoles.superUser, ValidRoles.admin) // es igual al metodo de @Get('private2'), solo que unido todo
  privateRoute3(
    @GetUser() user: User
  ) {
    return{
      ok: true,
      user
    }
  }

} 