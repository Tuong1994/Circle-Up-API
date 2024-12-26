import { Prisma } from '@prisma/client';

export type PostWithPayload = Prisma.PostGetPayload<{
  select: { id: true; medias: true; comments: true; likes: true; tags: true; followers: true };
}>;
