import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtPayloadRecieved } from './localAuthGuard.guard';

export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: { user: JwtPayloadRecieved; params: { userId: string } } =
      context.switchToHttp().getRequest();

    const { user, params } = request;
    if (!user || user.sub !== Number(params.userId)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
