import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Follow } from '@prisma/client';
import { FollowDto } from './follow.dto';
import utils from 'src/utils';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  async getFollows(query: QueryDto) {
    const { page, limit, sortBy } = query;
    let collection: Paging<Follow> = utils.defaultCollection();
    const follows = await this.prisma.follow.findMany({
      where: {
        AND: [{ isDelete: { equals: false } }],
      },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    collection = utils.paging<Follow>(follows, page, limit);
    return collection;
  }

  async getFollow(query: QueryDto) {
    const { followId } = query;
    const follow = await this.prisma.follow.findUnique({ where: { id: followId } });
    return follow;
  }

  async createFollow(follow: FollowDto) {
    const { followedId, followerId, postId } = follow;
    const newFollow = await this.prisma.follow.create({
      data: { followedId, followerId, postId, isDelete: false },
    });
    return newFollow;
  }

  async updateFollow(query: QueryDto, follow: FollowDto) {
    const { followId } = query;
    const { followedId, followerId, postId } = follow;
    await this.prisma.follow.update({ where: { id: followId }, data: { followedId, followerId, postId } });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeFollows(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const follows = await this.prisma.follow.findMany({ where: { id: { in: listIds } } });
    if (follows && !follows.length) throw new HttpException('Follows not found', HttpStatus.NOT_FOUND);
    await this.prisma.follow.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeFollowsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const follows = await this.prisma.follow.findMany({ where: { id: { in: listIds } } });
    if (follows && !follows.length) throw new HttpException('Follows not found', HttpStatus.NOT_FOUND);
    await this.prisma.follow.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restoreFollows() {
    const follows = await this.prisma.follow.findMany({ where: { isDelete: { equals: true } } });
    if (follows && !follows.length) throw new HttpException('There are no data to restored', HttpStatus.OK);
    await Promise.all(
      follows.map(async (follow) => {
        await this.prisma.follow.update({ where: { id: follow.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
