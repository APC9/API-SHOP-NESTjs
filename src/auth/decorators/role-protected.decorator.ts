import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

export const META_ROLES = 'roles'

export const RoleProtected = (...args: ValidRoles[]) => {

  // recibe un array de roles y los establece en la metadata con el nombre de  META_ROLES
  return SetMetadata(META_ROLES, args);
};
