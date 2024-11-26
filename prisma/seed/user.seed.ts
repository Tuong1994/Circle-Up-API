import { User } from '@prisma/client';
import { ERole } from '../../src/common/enum/base';
import utils from '../../src/utils';

const users: User[] = [
  {
    id: 'U_1',
    firstName: 'Tuong',
    lastName: 'Nham',
    password: utils.bcryptHash('123456'),
    role: ERole.USER,
    isDelete: false,
    resetToken: null,
    resetTokenExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default users;
