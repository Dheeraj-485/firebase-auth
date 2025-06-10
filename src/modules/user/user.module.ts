import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AbacService } from 'src/common/services/abac.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, AbacService],
})
export class UserModule {}
