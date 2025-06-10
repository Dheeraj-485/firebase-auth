import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbacService } from '../services/abac.service';
import { PrismaService } from 'prisma/prisma.service';
import { Abac_Action_key } from '../decorators/abac.decorator';
import admin from 'src/firebase/firebase.config';
import { AbacActionEnum } from '../services/action.enum';

@Injectable()
export class AbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    private abacService: AbacService,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const action = this.reflector.getAllAndOverride<string>(Abac_Action_key, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!action) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const idToken = request.headers['idtoken'];
    if (!idToken) {
      throw new UnauthorizedException('Token is missing');
    }

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token', e);
    }

    const user = await this.prisma.user.findUnique({
      where: { email: decoded.email },
      include: { userProfile: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not found in database');
    }

    request.user = user;

    // const resource = request.resource;
    const resource = {
      type: 'User',
      data: user,
    };

    const allowed = await this.abacService.canPerform(
      user,
      resource,
      action as AbacActionEnum,
    );
    console.log(`user:${user.role}, Resource:${resource}, action:${action}`);

    console.log(allowed);

    if (!allowed) {
      throw new ForbiddenException(
        `You do not have permission to perform "${action}" on this resource.`,
      );
    }

    return true;
  }
}
