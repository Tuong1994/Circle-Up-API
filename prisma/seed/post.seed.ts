import { Post } from '@prisma/client';
import { EAudience } from '../../src/common/enum/base';
import { EPostFeeling } from '../../src/modules/post/post.enum';

const feelings = Object.values(EPostFeeling).filter((value) => typeof value === 'number');

const posts: Post[] = Array.from({ length: 50 }, (_, index) => ({
  id: `P_${index + 1}`,
  content: `Post content for id P_${index + 1}`,
  userId: `U_${(index % 10) + 1}`, // Distributes userIds from U_1 to U_10
  feeling: feelings[index % Object.values(EPostFeeling).length] as EPostFeeling,
  audience: EAudience.PUBLIC,
  cityCode: null,
  isDelete: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default posts;
