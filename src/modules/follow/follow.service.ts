import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Follow } from '@prisma/client';
import { FollowDto } from './follow.dto';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE, REMOVE, NOT_FOUND, NO_DATA_RESTORE, RESTORE } = responseMessage;

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  private isNotDelete = { isDelete: { equals: false } };

  async getFollows(query: QueryDto) {
    const { page, limit, sortBy, postId, followedId, followerId } = query;
    const follows = await this.prisma.follow.findMany({
      where: { AND: [{ ...this.isNotDelete }, { postId }, { followedId }, { followerId }] },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    const collection: Paging<Follow> = utils.paging<Follow>(follows, page, limit);
    return collection;
  }

  async getFollow(query: QueryDto) {
    const { followId } = query;
    const follow = await this.prisma.follow.findUnique({
      where: { id: followId, ...this.isNotDelete },
    });
    return follow;
  }

  async createFollow(follow: FollowDto) {
    const { followedId, followerId, postId } = follow;
    const newFollow = await this.prisma.follow.create({
      data: { followedId, followerId, postId },
    });
    return newFollow;
  }

  async updateFollow(query: QueryDto, follow: FollowDto) {
    const { followId } = query;
    const { followedId, followerId, postId } = follow;
    await this.prisma.follow.update({ where: { id: followId }, data: { followedId, followerId, postId } });
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async removeFollows(query: QueryDto) {
    const { ids } = query;
    const listId = ids.split(',');
    const follows = await this.prisma.follow.findMany({ where: { id: { in: listId } } });
    if (follows && !follows.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.follow.updateMany({ where: { id: { in: listId } }, data: { isDelete: true } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async removeFollowsPermanent(query: QueryDto) {
    const { ids } = query;
    const listId = ids.split(',');
    const follows = await this.prisma.follow.findMany({ where: { id: { in: listId } } });
    if (follows && !follows.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.follow.deleteMany({ where: { id: { in: listId } } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async restoreFollows() {
    const follows = await this.prisma.follow.findMany({ where: { isDelete: { equals: true } } });
    if (follows && !follows.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      follows.map(async (follow) => {
        await this.prisma.follow.update({ where: { id: follow.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException(RESTORE, HttpStatus.OK);
  }
}
