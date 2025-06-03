import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'prisma/prisma.service';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import admin from 'src/firebase/firebase.config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const idToken = request.headers['idtoken'];

    if (!idToken) throw new UnauthorizedException('Token is missing');

    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded?.email) throw new UnauthorizedException('Invalid token');

    const user = await this.prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) throw new UnauthorizedException('User not found');

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Required: [${requiredRoles.join(', ')}], but your role is: ${user.role}`,
      );
    }

    request.user = user;
    return true;
  }
}
