import { UserEmail } from '@prisma/client';
import { EAudience } from '../../src/common/enum/base';

const userEmails: UserEmail[] = [
  {
    id: 'UE_1',
    email: 'nhambontuong68@gmail.com',
    userId: 'U_1',
    isDelete: false,
    audience: EAudience.PUBLIC,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default userEmails;
