import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { Role } from '@prisma/client';
import admin from 'src/firebase/firebase.config';
import axios from 'axios';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  private firebaseApiKey = process.env.FIREBASE_API_KEY;

  async signup(createAuthDto: CreateAuthDto) {
    const { email, password, role } = createAuthDto;

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
          password: 'firebase_will_handle',
          role: role || Role.USER,
          firebase_uid: createFirebaseUser.uid,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
}
