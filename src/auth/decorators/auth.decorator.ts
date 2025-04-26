import { applyDecorators,  UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetRoleProtected } from './get-role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interfaces/valid-rolres.enum';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    GetRoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard)
  );
}