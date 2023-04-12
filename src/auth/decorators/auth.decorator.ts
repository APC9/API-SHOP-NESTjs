import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ValidRoles } from '../interfaces';
import { RoleProtected } from './';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: ValidRoles[]) {

  return applyDecorators(
    // son decoradores sin el @
    RoleProtected(...roles), // recibe un array de roles y los establece en la metadata
    UseGuards(AuthGuard(), UserRoleGuard), //recibe los roles de la metadata y los compara
  );
}