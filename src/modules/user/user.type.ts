import { Prisma, User } from '@prisma/client';

export type UserResponse = Omit<User, 'password' | 'isDelete' | 'createdAt' | 'updatedAt'>;

export type UserWithPayload = Prisma.UserGetPayload<{
  select: { id: true; infos: true; account: true; works: true; educations: true; lived: true };
}>;
