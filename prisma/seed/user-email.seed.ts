import { UserEmail } from '@prisma/client';
import { EAudience } from '../../src/common/enum/base';
import utils from '../../src/utils';

const userEmails: UserEmail[] = [
  {
    id: 'UE_1',
    email: 'nhambontuong68@gmail.com',
    password: utils.bcryptHash('123456'),
    isDelete: false,
    userId: 'U_1',
    audience: EAudience.PRIVATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'UE_2',
    email: 'claire@example.com',
    password: utils.bcryptHash('123456'),
    isDelete: false,
    userId: 'U_2',
    audience: EAudience.PRIVATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'UE_3',
    email: 'kevin@example.com',
    password: utils.bcryptHash('123456'),
    isDelete: false,
    userId: 'U_3',
    audience: EAudience.PRIVATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'UE_4',
    email: 'bill@example.com',
    password: utils.bcryptHash('123456'),
    isDelete: false,
    userId: 'U_4',
    audience: EAudience.PRIVATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'UE_5',
    email: 'emily@example.com',
    password: utils.bcryptHash('123456'),
    isDelete: false,
    userId: 'U_5',
    audience: EAudience.PRIVATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'UE_6',
    email: 'anna@example.com',
    password: utils.bcryptHash('123456'),
    isDelete: false,
    userId: 'U_6',
    audience: EAudience.PRIVATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'UE_7',
    email: 'John@example.com',
    password: utils.bcryptHash('123456'),
    isDelete: false,
    userId: 'U_7',
    audience: EAudience.PRIVATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'UE_8',
    email: 'ben@example.com',
    password: utils.bcryptHash('123456'),
    isDelete: false,
    userId: 'U_8',
    audience: EAudience.PRIVATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'UE_9',
    email: 'eva@example.com',
    password: utils.bcryptHash('123456'),
    isDelete: false,
    userId: 'U_9',
    audience: EAudience.PRIVATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'UE_10',
    email: 'evan@example.com',
    password: utils.bcryptHash('123456'),
    isDelete: false,
    userId: 'U_10',
    audience: EAudience.PRIVATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default userEmails;
