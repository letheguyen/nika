import {
  Type,
  mixin,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { Role } from 'module/user/contants/constants';

export const RolesGuard = (...roles: Role[]): Type<CanActivate> => {
  class RolesGuardMixin implements CanActivate {
    matchRoles = (roles: Role[], userRole: Role) => roles.includes(userRole);

    canActivate(context: ExecutionContext) {
      if (roles.length) {
        const request = context.switchToHttp().getRequest();
        if (request.user) return this.matchRoles(roles, request.user.role);
        throw new UnauthorizedException();
      }
      return true;
    }
  }

  return mixin(RolesGuardMixin);
};

