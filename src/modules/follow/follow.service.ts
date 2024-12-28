import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from '../../common/type/base';
import { Follow } from '@prisma/client';
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
    
  }
}
