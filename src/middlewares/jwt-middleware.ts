import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class JWTmiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {}
}
