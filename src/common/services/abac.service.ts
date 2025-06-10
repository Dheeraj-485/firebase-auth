import { PrismaService } from 'prisma/prisma.service';
import { AbacActionEnum } from './action.enum';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class AbacService {
  constructor(private prisma: PrismaService) {}
  async canPerform(
    user: User,
    resource,
    action: AbacActionEnum,
  ): Promise<boolean> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { role: user.role },
      include: { permission: true },
    });

    console.log(' Role:', user.role);
    console.log(
      ' Permissions:',
      rolePermissions.map((rp) => ({
        action: rp.permission.action,
        resource: rp.permission.resource,
      })),
    );
    console.log(' Incoming Action:', action);
    console.log(' Resource Type:', resource?.type);
    console.log(' Resource Data ID:', resource?.data?.id);
    console.log(' User ID:', user.id);

    const hasPermission = rolePermissions.some(
      (rp) =>
        rp.permission.action === action &&
        rp.permission.resource === resource.type,
    );

    console.log(' Has Basic Permission:', hasPermission);

    if (!hasPermission) return false;

    if (action === AbacActionEnum.UPDATE_PROFILE) {
      const match = user.id === resource.data.id;
      return match;
    }

    return true;
  }
}

// import { PrismaService } from 'prisma/prisma.service';
// import { AbacActionEnum } from './action.enum';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AbacService {
//   constructor(private prisma: PrismaService) {}

//   async canPerform(
//     user: any,
//     resource: any,
//     action: AbacActionEnum,
//   ): Promise<boolean> {
//     console.log('🔍 Incoming ABAC check');
//     console.log('👤 User ID:', user.id);
//     console.log('👤 User Role:', user.role);
//     console.log('📦 Resource Type:', resource?.type);
//     console.log('📦 Resource Data:', resource?.data);
//     console.log('🎯 Action:', action);
//     const rolePermissions = await this.prisma.rolePermission.findMany({
//       where: { role: user.role },
//       include: { permission: true },
//     });

//     const hasPermission = rolePermissions.some(
//       (rp) =>
//         rp.permission.action === action &&
//         rp.permission.resource === resource.type,
//     );

//     if (!hasPermission) return false;

//     // Optional: add attribute-based conditions
//     if (action === AbacActionEnum.UPDATE_PROFILE) {
//       return user.id === resource.data.id;
//     }

//     return true;
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { AbacActionEnum } from './action.enum';
// import { Role } from '@prisma/client';

// @Injectable()
// export class AbacService {
//   canPerform(user: any, resource: any, action: AbacActionEnum): boolean {
//     const isOwner = user.id === resource.id;

//     switch (user.role) {
//       case Role.ADMIN:
//         if (
//           [AbacActionEnum.GET_USERS, AbacActionEnum.DELETE_USER].includes(
//             action,
//           )
//         )
//           return true;

//         // if (action === 'updateProfile') return false;

//         break;

//       case Role.USER:
//         if ([AbacActionEnum.GET_PROFILE].includes(action)) return isOwner;

//         if (action === AbacActionEnum.UPDATE_PROFILE) {
//           const nameCheck = user.userProfile?.name === 'dheeraj';
//           const genderCheck = user.userProfile?.gender === 'male';
//           const emailCheck = user.email.startsWith('d');

//           return (
//             isOwner &&
//             //    && nameCheck;
//             // genderCheck
//             emailCheck
//           );
//         }
//         break;
//     }

//     return false;
//   }
// }
