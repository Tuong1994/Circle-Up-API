import { PostOnUser } from '@prisma/client';

const postOnUsers: PostOnUser[] = [
  {
    id: 'PU_1',
    userId: 'U_1',
    postId: 'P_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default postOnUsers;
