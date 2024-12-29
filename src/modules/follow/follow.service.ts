import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from '../../common/type/base';
import { Follow } from '@prisma/client';
import { FollowDto } from './follow.dto';
import utils from '../../utils';

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
    if (!follow) throw new HttpException('Follow not found', HttpStatus.NOT_FOUND);
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
    const listId = ids.split(',');
    const follows = await this.prisma.follow.findMany({ where: { id: { in: listId } } });
    if (follows && !follows.length) throw new HttpException('Follows not found', HttpStatus.NOT_FOUND);
    await this.prisma.follow.updateMany({ where: { id: { in: listId } }, data: { isDelete: true } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeFollowsPermanent(query: QueryDto) {
    const { ids } = query;
    const listId = ids.split(',');
    const follows = await this.prisma.follow.findMany({ where: { id: { in: listId } } });
    if (follows && !follows.length) throw new HttpException('Follows not found', HttpStatus.NOT_FOUND);
    await this.prisma.follow.deleteMany({ where: { id: { in: listId } } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restoreFollows() {
    const follows = await this.prisma.follow.findMany({ where: { isDelete: { equals: true } } });
    if (follows && !follows.length) throw new HttpException('No data to restore', HttpStatus.OK);
    await Promise.all(
      follows.map(async (follow) => {
        await this.prisma.follow.update({ where: { id: follow.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
