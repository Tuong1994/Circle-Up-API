import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithPayload } from './user.type';

@Injectable()
export class UserHelper {
  constructor(private prisma: PrismaService) {}

  getUserFields(): Prisma.UserSelect {
    return {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      resetToken: true,
      resetTokenExpires: true,
    };
  }

  getUserEmailFields(): Prisma.UserEmailSelect {
    return { email: true, audience: true };
  }

  getUserInfoFields(): Prisma.UserInfoSelect {
    return { content: true, type: true, audience: true };
  }

  getUserWorkFields(): Prisma.UserWorkSelect {
    return {
      id: true,
      company: true,
      position: true,
      description: true,
      cityCode: true,
      audience: true,
      isCurrently: true,
    };
  }

  getUserEducationFields(): Prisma.UserEducationSelect {
    return {
      id: true,
      school: true,
      description: true,
      audience: true,
      isGraduated: true,
    };
  }

  getUserLivedFields(): Prisma.UserLivedSelect {
    return { cityCode: true, districtCode: true, audience: true };
  }

  getDateRangeFields(): Prisma.DateRangeSelect {
    return {
      year: true,
      month: true,
      date: true,
    };
  }

  async handleRemoveUserInfos(user: UserWithPayload) {
    await this.prisma.userInfo.updateMany({ where: { userId: user.id }, data: { isDelete: true } });
  }

  async handleRemoveUserLived(user: UserWithPayload) {
    await this.prisma.userLived.update({ where: { userId: user.id }, data: { isDelete: true } });
  }

  async handleRemoveUserWorks(user: UserWithPayload) {
    await Promise.all(
      user.works.map(async (work) => {
        const timePeriod = await this.prisma.timePeriod.findUnique({ where: { userWorkId: work.id } });
        await this.prisma.dateRange.update({
          where: { startDateId: timePeriod.id },
          data: { isDelete: true },
        });
        await this.prisma.dateRange.update({
          where: { endDateId: timePeriod.id },
          data: { isDelete: true },
        });
        await this.prisma.userWork.update({
          where: { id: work.id },
          data: {
            isDelete: true,
            timePeriod: {
              update: {
                where: { userWorkId: work.id },
                data: { isDelete: true },
              },
            },
          },
        });
      }),
    );
  }

  async handleRemoveUserEducations(user: UserWithPayload) {
    await Promise.all(
      user.educations.map(async (education) => {
        const timePeriod = await this.prisma.timePeriod.findUnique({
          where: { userEducationId: education.id },
        });
        await this.prisma.dateRange.update({
          where: { startDateId: timePeriod.id },
          data: { isDelete: true },
        });
        await this.prisma.dateRange.update({
          where: { endDateId: timePeriod.id },
          data: { isDelete: true },
        });
        await this.prisma.userEducation.update({
          where: { id: education.id },
          data: {
            isDelete: true,
            timePeriod: {
              update: {
                where: { userEducationId: education.id },
                data: { isDelete: true },
              },
            },
          },
        });
      }),
    );
  }
}
