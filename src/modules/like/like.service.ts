import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { LikeDto } from './like.dto';
import { Like } from '@prisma/client';
import { Paging } from 'src/common/type/base';
import utils from 'src/utils';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async getLikesPaging(query: QueryDto) {
    const { page, limit, sortBy } = query;
    let collection: Paging<Like> = utils.defaultCollection();
    const likes = await this.prisma.like.findMany({
      where: { AND: [{ isDelete: { equals: false } }] },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    if (likes && likes.length > 0) collection = utils.paging<Like>(likes, page, limit);
    return collection;
  }

  async getLike(query: QueryDto) {
    const { likeId } = query;
    const like = await this.prisma.like.findUnique({
      where: { id: likeId, isDelete: { equals: false } },
      include: { user: true },
    });
    return like;
  }

  async createLike(like: LikeDto) {
    const { userId, postId } = like;
    const newLike = await this.prisma.like.create({ data: { userId, postId, isDelete: false } });
    return newLike;
  }

  async updateLike(query: QueryDto, like: LikeDto) {
    const { likeId } = query;
    const { userId, postId } = like;
    await this.prisma.like.update({ where: { id: likeId }, data: { userId, postId } });
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeLikes(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const likes = await this.prisma.like.findMany({ where: { id: { in: listIds } } });
    if (likes && !likes.length) throw new HttpException('Like not found', HttpStatus.NOT_FOUND);
    await this.prisma.like.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }
}
