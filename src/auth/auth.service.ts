import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { PrismaClient } from '@prisma/client';
import admin from 'src/firebase/firebase.config';
import axios from 'axios';
import { PrismaService } from 'prisma/prisma.service';
import bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  private firebaseApiKey = process.env.FIREBASE_API_KEY;

  async signup(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;

    try {
      const findEmail = await this.prisma.user.findUnique({ where: { email } });
      if (findEmail) {
        throw new ConflictException('User with this email  already exists');
      }

      const createFirebaseUser = await admin.auth().createUser({
        email,
        password,
      });

      // const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          email,
          password,
          firebase_uid: createFirebaseUser.uid,
        },
      });

      const { password: removed, ...safeUser } = user;
      return {
        message: 'User created successfully',
        uid: createFirebaseUser.uid,
        user: safeUser,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        // 'Failed to create user: ' + error.message,
        `Failed to create user: ${error?.message}`,
      );
    }
  }

  async login(loginDTO: LoginDto) {
    const { email, password } = loginDTO;
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.firebaseApiKey}`;

      const response = await axios.post(url, {
        email: email,
        password: password,
        returnSecureToken: true,
      });

      const { idToken } = response.data;

      const decodedToken = await admin.auth().verifyIdToken(idToken);

      const user = await this.prisma.user.findUnique({
        where: { email: decodedToken.email },
        include: {
          userProfile: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found in DB');
      }

      return {
        message: 'Login successful',
        firebaseToken: idToken,
        response: response.data,
        displayName: user.userProfile?.name,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      console.error(
        'Firebase login error:',
        error.response?.data || error.message,
      );
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async createUserProfile() {
    try {
    } catch (error) {}
  }

  // async login(loginDto: LoginDto) {
  //   const { email, password } = loginDto;

  //   const user = await this.prisma.user.findFirst({ where: { email } });
  //   if (!user) {
  //     throw new ConflictException('Email not found');
  //   }

  //   if (!this.firebaseApiKey) {
  //     throw new InternalServerErrorException(
  //       'Firebase API key is not configured',
  //     );
  //   }

  //   try {
  //     const passwordValid = await bcrypt.compare(password, user.password);
  //     if (!passwordValid) {
  //       throw new UnauthorizedException('Invalid credentials');
  //     }
  //     const response = await axios.post(
  //       `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.firebaseApiKey}`,
  //       {
  //         email,
  //         password,
  //         returnSecureToken: true,
  //       },
  //     );

  //     return {
  //       message: 'Login successful',
  //       idToken: response.data.idToken,
  //       refreshToken: response.data.refreshToken,
  //       expiresIn: response.data.expiresIn,
  //       uid: response.data.localId,
  //     };
  //   } catch (error) {
  //     const msg = error.response?.data?.error?.message;
  //     if (msg === 'EMAIL_NOT_FOUND' || msg === 'INVALID_PASSWORD') {
  //       throw new UnauthorizedException('Invalid email or password');
  //     }
  //     throw new InternalServerErrorException('Login failed: ' + msg);
  //   }
  // }
}
