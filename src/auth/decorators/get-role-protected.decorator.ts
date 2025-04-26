import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-rolres.enum';
export const META_ROLES = 'roles';

export const GetRoleProtected = (...args: ValidRoles[]) => SetMetadata(META_ROLES, args);
