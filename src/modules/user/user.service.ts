import {
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
import { updateAddressDTO } from './dto/update-address.dto';

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
      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const existingProfile = await this.prisma.profile.findUnique({
        where: { user_id: user.id },
      });
      if (existingProfile) {
        throw new ConflictException('Profile already created');
      }

      const profile = await this.prisma.profile.create({
        data: {
          user_id: user.id,
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

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async deleteUser(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User not found');

      const deletedUser = this.prisma.user.delete({ where: { id } });
      return {
        message: 'User deleted Successfully',
        deletedUser,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete User: ${error?.message}`,
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
          userAddresses: true,
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
    try {
      if (!idToken) {
        throw new BadRequestException('Token not provided');
      }
      console.log(idToken);

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

      const newAddress = await this.prisma.addresses.create({
        data: {
          user_id: user.id,
          ...createAddressDTO,
        },
      });
      return {
        message: 'Address created successfully',
        address: newAddress,
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException(
        `Failed to create address: ${error?.message}`,
      );
    }
  }

  async getAddress(idToken: string) {
    try {
      if (!idToken) {
        throw new NotFoundException('Token not found');
      }

      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!decoded) {
        throw new UnauthorizedException('Unauthorized user ');
      }
      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });
      if (!user) {
        throw new NotFoundException('user not found');
      }

      const getAddress = await this.prisma.addresses.findMany({
        where: {
          user_id: user?.id,
        },
      });

      return {
        message: 'User address fetched',
        getAddress,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get Address: ${error?.message}`,
      );
    }
  }

  async updateAddress(
    idToken: string,
    addressId: number,
    updateAddressDTO: updateAddressDTO,
  ) {
    try {
      if (!idToken) {
        throw new NotFoundException('Token is required');
      }

      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!decoded) {
        throw new UnauthorizedException('Unauthorized user');
      }

      // 1 get user,

      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      //2. Address update
      // find address

      // Verify address belongs to user
      const address = await this.prisma.addresses.findUnique({
        where: { id: addressId },
      });

      if (!address || address.user_id !== user.id) {
        throw new NotFoundException('Address not found or unauthorized');
      }
      const updatedAddress = await this.prisma.addresses.update({
        where: {
          id: addressId,
        },
        data: {
          ...updateAddressDTO,
        },
      });
      return {
        message: 'Address updated successfully',
        address: updatedAddress,
      };
    } catch (error) {
      console.error('Error updating address:', error);
      throw new InternalServerErrorException(
        `Failed to update address: ${error?.message}`,
      );
    }
  }

  async deleteAddress(idToken: string, addressId: number) {
    try {
      if (!idToken) {
        throw new BadRequestException('Token is required');
      }

      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!decoded) {
        throw new UnauthorizedException('Unauthorized user');
      }

      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const address = await this.prisma.addresses.findUnique({
        where: { id: addressId },
      });

      if (!address || address.user_id !== user.id) {
        throw new NotFoundException('Address not found or unauthorized');
      }

      await this.prisma.addresses.delete({
        where: { id: addressId },
      });

      return {
        message: 'Address deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting address:', error);
      throw new InternalServerErrorException(
        `Failed to delete address: ${error?.message}`,
      );
    }
  }
}
