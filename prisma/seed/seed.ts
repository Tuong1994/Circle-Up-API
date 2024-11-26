import { PrismaClient } from '@prisma/client';
import cities from './city.seed';
import districts from './district.seed';
import wards from './ward.seed';
import users from './user.seed';
import userEmails from './user-email.seed';
import posts from './post.seed';
import postOnUsers from './post-tag.seed';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.createMany({ data: users });
  await prisma.userEmail.createMany({ data: userEmails });
  await prisma.post.createMany({ data: posts });
  await prisma.postOnUser.createMany({ data: postOnUsers });
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
