import { Post } from '@prisma/client';
import { EAudience } from '../../src/common/enum/base';
import { EPostFeeling } from '../../src/modules/post/post.enum';

const posts: Post[] = [
  {
    id: 'P_1',
    content: 'What is life about?',
    feeling: EPostFeeling.THINKING_ABOUT,
    cityCode: null,
    userId: 'U_1',
    audience: EAudience.PUBLIC,
    isDelete: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default posts;
