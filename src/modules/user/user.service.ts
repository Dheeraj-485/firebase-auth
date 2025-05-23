import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserProfileDto } from './dto/user-profile';
import { PrismaService } from 'prisma/prisma.service';
import admin from 'src/firebase/firebase.config';
import { updateProfileDTO } from './dto/update-profile';
import { userAddressDTO } from './dto/user-addresses';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createProfile(idToken: string, createProfileDTO: CreateUserProfileDto) {
    try {
      if (!idToken) {
        throw new NotFoundException('Please provide token');
      }

      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!decoded) {
        throw new UnauthorizedException('Unauthorized user');
      }
      const User = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!User) {
        throw new UnauthorizedException('User not found');
      }

      const existingProfile = await this.prisma.profile.findUnique({
        where: { user_id: User.id },
      });
      if (existingProfile) {
        throw new ConflictException('Profile already created');
      }

      const profile = await this.prisma.profile.create({
        data: {
          user_id: User.id,
          ...createProfileDTO,
        },
      });

      return {
        message: 'User profile created',
        profile,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        // message: 'Failed to create user profile',
        `Failed to create user profile: ${error?.message}`,
      );
    }
  }

  async userProfile(idToken: string) {
    try {
      // const { idToken } =
      if (!idToken) {
        return new BadRequestException('No token provided');
      }
      const verify = await admin.auth().verifyIdToken(idToken);

      if (!verify) {
        throw new UnauthorizedException('Unauthorized user');
      }

      const user = await this.prisma.user.findUnique({
        where: { email: verify.email },
        include: {
          userProfile: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        email: verify.email,
        // verify,
        user: {
          ...user,
          password: 'firebase_will_handle',
        },
        // profile: user.userProfile,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        // 'Server error user profile',
        `Failed to get user profile: ${error?.message}`,
      );
    }
  }

  async updateProfile(idToken: string, updateProfileDTO: updateProfileDTO) {
    try {
      if (!idToken) {
        throw new BadRequestException('Token is required');
      }

      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!decoded) {
        throw new UnauthorizedException('Unauthrozied');
      }

      const User = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });
      if (!User) {
        throw new UnauthorizedException('User not found');
      }

      const updatedProfile = await this.prisma.profile.update({
        where: { user_id: User.id },
        data: {
          ...updateProfileDTO,
        },
      });
      console.log('Updated profile:', updatedProfile);

      return {
        message: 'Profile updated successfully',
        profile: updatedProfile,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        // // message: 'Failed to update user profile',
        // error: error?.message,
        `Failed to update user profile: ${error?.message}`,
      );
    }
  }

  // For address api
  async createAddress(idToken: string, createAddressDTO: userAddressDTO) {
    if (!idToken) {
      throw new BadRequestException('Token not provided');
    }
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded) {
      throw new UnauthorizedException('Unauthorized user');
    }

    //1get user from decoded

    const user = await this.prisma.user.findUnique({
      where: { email: decoded.email },
      include: { userAddresses: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    //2Now create address of that user

    const address = await this.prisma.addresses.create({
      data: {
        user_id: user.id,
        ...createAddressDTO,
      },
    });
  }
}
