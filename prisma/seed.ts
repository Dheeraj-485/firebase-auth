import { PrismaClient, Role } from '@prisma/client';
import { AbacActionEnum } from 'src/common/services/action.enum';

const prisma = new PrismaClient();

async function main() {
  const p1 = await prisma.permission.create({
    data: { action: AbacActionEnum.GET_USERS, resource: 'User' },
  });

  const p2 = await prisma.permission.create({
    data: { action: AbacActionEnum.DELETE_USER, resource: 'User' },
  });
  const p3 = await prisma.permission.create({
    data: { action: AbacActionEnum.GET_PROFILE, resource: 'User' },
  });
  const p4 = await prisma.permission.create({
    data: { action: AbacActionEnum.UPDATE_PROFILE, resource: 'User' },
  });
  const p5 = await prisma.permission.create({
    data: { action: AbacActionEnum.CREATE_ADDRESS, resource: 'Address' },
  });
  const p6 = await prisma.permission.create({
    data: { action: AbacActionEnum.DELETE_ADDRESS, resource: 'Address' },
  });

  await prisma.rolePermission.createMany({
    data: [
      {
        role: Role.ADMIN,
        permissionId: p1.id,
      },
      {
        role: Role.ADMIN,
        permissionId: p2.id,
      },
      {
        role: Role.USER,
        permissionId: p3.id,
      },
      {
        role: Role.USER,
        permissionId: p4.id,
      },
      {
        role: Role.USER,
        permissionId: p5.id,
      },
      {
        role: Role.USER,
        permissionId: p6.id,
      },
    ],
  });
}

main()
  .then(() => console.log('Seeded permissions successfully'))
  .catch((error) => console.error(`Error seeding permissions: ${error}`))
  .finally(() => prisma.$disconnect());
