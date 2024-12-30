import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { LikeDto } from './like.dto';
import { Like } from '@prisma/client';
import { Paging } from 'src/common/type/base';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE, REMOVE, NOT_FOUND } = responseMessage;

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  private isNotDelete = { isDelete: { equals: false } };

  async getLikesPaging(query: QueryDto) {
    const { page, limit, sortBy } = query;
    let collection: Paging<Like> = utils.defaultCollection();
    const likes = await this.prisma.like.findMany({
      where: this.isNotDelete,
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    if (likes && likes.length > 0) collection = utils.paging<Like>(likes, page, limit);
    return collection;
  }

  async getLike(query: QueryDto) {
    const { likeId } = query;
    const like = await this.prisma.like.findUnique({
      where: { id: likeId, ...this.isNotDelete },
      include: { user: true },
    });
    return like;
  }

  async createLike(like: LikeDto) {
    const { userId, postId } = like;
    const newLike = await this.prisma.like.create({ data: { userId, postId } });
    return newLike;
  }

  async updateLike(query: QueryDto, like: LikeDto) {
    const { likeId } = query;
    const { userId, postId } = like;
    await this.prisma.like.update({ where: { id: likeId }, data: { userId, postId } });
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async removeLikes(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const likes = await this.prisma.like.findMany({ where: { id: { in: listIds } } });
    if (likes && !likes.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.like.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }
}
