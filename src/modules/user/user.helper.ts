import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithPayload } from './user.type';

@Injectable()
export class UserHelper {
  constructor(private prisma: PrismaService) {}

  private isNotDelete = { isDelete: { equals: false } };

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
    return { id: true, email: true, audience: true };
  }

  getUserInfoFields(): Prisma.UserInfoSelect {
    return { id: true, content: true, type: true, audience: true };
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
    return { id: true, cityCode: true, districtCode: true, audience: true };
  }

  getDateRangeFields(): Prisma.DateRangeSelect {
    return {
      id: true,
      year: true,
      month: true,
      date: true,
    };
  }

  getTimePeriodSelection() {
    return {
      where: this.isNotDelete,
      select: {
        startDate: { where: this.isNotDelete, select: { ...this.getDateRangeFields() } },
        endDate: { where: this.isNotDelete, select: { ...this.getDateRangeFields() } },
      },
    };
  }

  getAccountSelection() {
    return { where: this.isNotDelete, select: { ...this.getUserEmailFields() } };
  }

  getInfoSelection() {
    return { where: this.isNotDelete, select: { ...this.getUserInfoFields() } };
  }

  getWorkSelection() {
    return {
      where: this.isNotDelete,
      select: { ...this.getUserWorkFields(), timePeriod: { ...this.getTimePeriodSelection() } },
    };
  }

  getEducationSelection() {
    return {
      where: this.isNotDelete,
      select: { ...this.getUserEducationFields(), timePeriod: { ...this.getTimePeriodSelection() } },
    };
  }

  getLivedSelection() {
    return { where: this.isNotDelete, select: { ...this.getUserLivedFields() } };
  }

  async handleUpdateIsDeleteUserInfos(user: UserWithPayload, isDelete: boolean) {
    await this.prisma.userInfo.updateMany({ where: { userId: user.id }, data: { isDelete } });
  }

  async handleUpdateIsDeleteUserLived(user: UserWithPayload, isDelete: boolean) {
    await this.prisma.userLived.update({ where: { userId: user.id }, data: { isDelete } });
  }

  async handleUpdateIsDeleteUserWorks(user: UserWithPayload, isDelete: boolean) {
    await Promise.all(
      user.works.map(async (work) => {
        const timePeriod = await this.prisma.timePeriod.findUnique({ where: { userWorkId: work.id } });
        await this.prisma.dateRange.update({
          where: { startDateId: timePeriod.id },
          data: { isDelete },
        });
        await this.prisma.dateRange.update({
          where: { endDateId: timePeriod.id },
          data: { isDelete },
        });
        await this.prisma.userWork.update({
          where: { id: work.id },
          data: {
            isDelete,
            timePeriod: {
              update: {
                where: { userWorkId: work.id },
                data: { isDelete },
              },
            },
          },
        });
      }),
    );
  }

  async handleUpdateIsDeleteUserEducations(user: UserWithPayload, isDelete: boolean) {
    await Promise.all(
      user.educations.map(async (education) => {
        const timePeriod = await this.prisma.timePeriod.findUnique({
          where: { userEducationId: education.id },
        });
        await this.prisma.dateRange.update({
          where: { startDateId: timePeriod.id },
          data: { isDelete },
        });
        await this.prisma.dateRange.update({
          where: { endDateId: timePeriod.id },
          data: { isDelete },
        });
        await this.prisma.userEducation.update({
          where: { id: education.id },
          data: {
            isDelete,
            timePeriod: {
              update: {
                where: { userEducationId: education.id },
                data: { isDelete },
              },
            },
          },
        });
      }),
    );
  }
}
