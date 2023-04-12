import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

//Esto es una constante  cosnt META_ROLES = 'roles'
import { META_ROLES } from '../../decorators';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // Aqui recibimos el arreglo de roles de la metadata con la key META_ROLES
    const validRole: string[] = this.reflector.getAllAndOverride<string[]>(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Aqui recibimos el usuario de la request
    const  req = context.switchToHttp().getRequest();
    const  user = req.user as User;

    //  verificamos si tenemos el usuario y comparamos si tienen el rol valido
    if (!user)
      throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if ( validRole.includes(role) )
        return true;
    }

    throw new BadRequestException('User does not have the required role');
  }
}
