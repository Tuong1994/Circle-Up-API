import { PrismaClient } from '@prisma/client';
import users from './user.seed';
import userAddresses from './user-address.seed';
import userPermissions from './user-permission';
import cities from './city.seed';
import districts from './district.seed';
import wards from './ward.seed';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.createMany({ data: users });
  await prisma.userAddress.createMany({ data: userAddresses });
  await prisma.userPermission.createMany({ data: userPermissions });
  await prisma.city.createMany({ data: cities });
  await prisma.district.createMany({ data: districts });
  await prisma.ward.createMany({ data: wards });
};

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.log(error);
    prisma.$disconnect();
  })
  .finally(() => prisma.$disconnect());
