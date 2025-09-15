import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { JwtPayload } from './local-auth.guard';

export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: { user: JwtPayload; params: { userId: string } } = context
      .switchToHttp()
      .getRequest();

    const { user, params } = request;
    if (!user || user.sub !== Number(params.userId)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
