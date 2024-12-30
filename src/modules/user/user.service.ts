import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { UserResponse } from './user.type';
import { UserDto, UserEducationDto, UserInfoDto, UserLivedDto, UserUpdateDto, UserWorkDto } from './user.dto';
import { EAudience } from 'src/common/enum/base';
import { EUserInfoType } from './user.enum';
import { UserEmail, UserInfo } from '@prisma/client';
import { UserHelper } from './user.helper';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE, REMOVE, NOT_FOUND, RESTORE, NO_DATA_RESTORE, SERVER_ERROR } = responseMessage;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userHelper: UserHelper,
  ) {}

  private isNotDelete = { isDelete: { equals: false } };

  async getUsers(query: QueryDto) {
    const { page, limit, keywords, sortBy } = query;
    let collection: Paging<UserResponse> = utils.defaultCollection();
    const users = await this.prisma.user.findMany({
      where: this.isNotDelete,
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: {
        ...this.userHelper.getUserFields(),
        account: { where: this.isNotDelete, select: { ...this.userHelper.getUserEmailFields() } },
        infos: { where: this.isNotDelete, select: { ...this.userHelper.getUserInfoFields() } },
      },
    });
    if (keywords) {
      const filterUsers = users.filter(
        (user) =>
          utils.filterByKeywords(user.account.email, keywords) ||
          utils.filterByKeywords(user.firstName, keywords) ||
          utils.filterByKeywords(user.lastName, keywords),
      );
      collection = utils.paging<UserResponse>(filterUsers, page, limit);
    } else collection = utils.paging<UserResponse>(users, page, limit);
    return collection;
  }

  async getUser(query: QueryDto) {
    const { userId } = query;
    const user = await this.prisma.user.findUnique({
      where: { id: userId, ...this.isNotDelete },
      select: {
        ...this.userHelper.getUserFields(),
        account: this.userHelper.getAccountSelection(),
        infos: this.userHelper.getInfoSelection(),
        works: this.userHelper.getWorkSelection(),
        educations: this.userHelper.getEducationSelection(),
        lived: this.userHelper.getLivedSelection(),
      },
    });
    return user;
  }

  async createUser(user: UserDto) {
    const { email, password, firstName, lastName, role } = user;
    const hash = utils.bcryptHash(password);
    const fullName = this.userHelper.getUserFullName(firstName, lastName);
    const newUser = await this.prisma.user.create({
      data: { firstName, lastName, fullName, role },
      select: { ...this.userHelper.getUserFields() },
    });
    const newUserEmail = await this.prisma.userEmail.create({
      data: { email, password: hash, userId: newUser.id, audience: EAudience.PUBLIC },
      select: { ...this.userHelper.getUserEmailFields() },
    });
    const userResponse = { ...newUser, account: { ...newUserEmail } };
    return userResponse;
  }

  async createUserInfo(info: UserInfoDto) {
    const { email, content, type, userId, audience } = info;
    let newInfo: UserInfo | UserEmail;
    if (type === EUserInfoType.EMAIL) {
      newInfo = await this.prisma.userEmail.create({
        data: { email, password: undefined, audience, userId },
      });
    } else {
      newInfo = await this.prisma.userInfo.create({
        data: { content, type, audience, userId },
      });
    }
    return newInfo;
  }

  async createUserWork(work: UserWorkDto) {
    const { company, position, cityCode, description, isCurrently, userId, audience, startDate, endDate } =
      work;
    const newWork = await this.prisma.userWork.create({
      data: { company, position, cityCode, description, isCurrently, audience, userId },
    });
    if (!newWork) throw new HttpException(SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    const newTimePeriod = await this.prisma.timePeriod.create({ data: { userWorkId: newWork.id } });
    await this.prisma.dateRange.create({
      data: { ...startDate, startDateId: newTimePeriod.id },
    });
    if (!newWork.isCurrently) {
      await this.prisma.dateRange.create({
        data: { ...endDate, endDateId: newTimePeriod.id },
      });
    }
    return newWork;
  }

  async createUserEducation(eduaction: UserEducationDto) {
    const { school, description, isGraduated, audience, userId, startDate, endDate } = eduaction;
    const newEducation = await this.prisma.userEducation.create({
      data: { school, description, isGraduated, audience, userId },
    });
    const newTimePeriod = await this.prisma.timePeriod.create({
      data: { userEducationId: newEducation.id },
    });
    await this.prisma.dateRange.create({
      data: { ...startDate, startDateId: newTimePeriod.id },
    });
    if (!newEducation.isGraduated) {
      await this.prisma.dateRange.create({
        data: { ...endDate, endDateId: newTimePeriod.id },
      });
    }
    return newEducation;
  }

  async createUserLived(lived: UserLivedDto) {
    const { cityCode, districtCode, audience, userId } = lived;
    const newLived = await this.prisma.userLived.create({
      data: { cityCode, districtCode, audience, userId },
    });
    return newLived;
  }

  async updateUser(query: QueryDto, user: UserUpdateDto) {
    const { userId } = query;
    const { firstName, lastName, role } = user;
    const fullName = this.userHelper.getUserFullName(firstName, lastName);
    await this.prisma.user.update({ where: { id: userId }, data: { firstName, lastName, fullName, role } });
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async updateUserInfo(query: QueryDto, info: UserInfoDto) {
    const { userInfoId } = query;
    const { content, type, userId, audience } = info;
    await this.prisma.userInfo.update({
      where: { id: userInfoId },
      data: { content, type, userId, audience },
    });
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async updateUserWork(query: QueryDto, work: UserWorkDto) {
    const { userWorkId } = query;
    const { company, position, cityCode, description, audience, isCurrently, userId, startDate, endDate } =
      work;
    await this.prisma.userWork.update({
      where: { id: userWorkId },
      data: { company, position, cityCode, description, audience, isCurrently, userId },
    });
    await this.prisma.dateRange.update({ where: { id: startDate.id }, data: { ...startDate } });
    if (!isCurrently) {
      const userWork = await this.prisma.userWork.findUnique({
        where: { id: userWorkId },
        select: { timePeriod: { select: { endDate: true } } },
      });
      if (!userWork.timePeriod.endDate) await this.prisma.dateRange.create({ data: { ...endDate } });
      else await this.prisma.dateRange.update({ where: { id: endDate.id }, data: { ...endDate } });
    }
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async updateUserEducation(query: QueryDto, education: UserEducationDto) {
    const { userEducationId } = query;
    const { school, description, audience, isGraduated, userId, startDate, endDate } = education;
    await this.prisma.userEducation.update({
      where: { id: userEducationId },
      data: { school, description, audience, isGraduated, userId },
    });
    await this.prisma.dateRange.update({ where: { id: startDate.id }, data: { ...startDate } });
    if (!isGraduated) {
      const userEducation = await this.prisma.userEducation.findUnique({
        where: { id: userEducationId },
        select: { timePeriod: { select: { endDate: true } } },
      });
      if (!userEducation.timePeriod.endDate) await this.prisma.dateRange.create({ data: { ...endDate } });
      else await this.prisma.dateRange.update({ where: { id: endDate.id }, data: { ...endDate } });
    }
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async updateUserLived(query: QueryDto, lived: UserLivedDto) {
    const { userLivedId } = query;
    const { cityCode, districtCode, audience, userId } = lived;
    await this.prisma.userLived.update({
      where: { id: userLivedId },
      data: { cityCode, districtCode, audience, userId },
    });
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async removeUsers(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const users = await this.prisma.user.findMany({
      where: { id: { in: listIds } },
      select: { id: true, infos: true, account: true, works: true, educations: true, lived: true },
    });
    if (users && !users.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.user.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      users.map(async (user) => {
        await this.prisma.userEmail.update({ where: { userId: user.id }, data: { isDelete: true } });
        if (user.lived) await this.userHelper.handleUpdateIsDeleteUserLived(user, true);
        if (user.infos.length > 0) await this.userHelper.handleUpdateIsDeleteUserInfos(user, true);
        if (user.works.length > 0) await this.userHelper.handleUpdateIsDeleteUserWorks(user, true);
        if (user.educations.length > 0) await this.userHelper.handleUpdateIsDeleteUserEducations(user, true);
      }),
    );
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async removeUsersPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const users = await this.prisma.user.findMany({ where: { id: { in: listIds } } });
    if (users && !users.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.user.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async restoreUsers() {
    const users = await this.prisma.user.findMany({
      where: { isDelete: { equals: true } },
      select: { id: true, infos: true, account: true, works: true, educations: true, lived: true },
    });
    if (users && !users.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      users.map(async (user) => {
        await this.prisma.user.update({ where: { id: user.id }, data: { isDelete: false } });
        await this.prisma.userEmail.update({ where: { userId: user.id }, data: { isDelete: false } });
        if (user.lived) await this.userHelper.handleUpdateIsDeleteUserLived(user, false);
        if (user.infos.length > 0) await this.userHelper.handleUpdateIsDeleteUserInfos(user, false);
        if (user.works.length > 0) await this.userHelper.handleUpdateIsDeleteUserWorks(user, false);
        if (user.educations.length > 0) await this.userHelper.handleUpdateIsDeleteUserEducations(user, false);
      }),
    );
    throw new HttpException(RESTORE, HttpStatus.OK);
  }
}
