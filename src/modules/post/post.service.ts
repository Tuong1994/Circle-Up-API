import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Post } from '@prisma/client';
import { PostHelper } from './post.helper';
import { PostDto } from './post.dto';
import utils from 'src/utils';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private postHelper: PostHelper,
  ) {}

  private isNotDelete = { isDelete: { equals: false } };

  async getPosts(query: QueryDto) {
    const { page, limit, sortBy } = query;
    const posts = await this.prisma.post.findMany({
      where: this.isNotDelete,
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: {
        ...this.postHelper.getPostFields(),
        user: { select: { ...this.postHelper.getPostUserFields() } },
        medias: { where: this.isNotDelete, select: { ...this.postHelper.getPostMediaFields() } },
      },
    });
    const collection: Paging<Post> = utils.paging<Post>(posts, page, limit);
    return collection;
  }

  async getPost(query: QueryDto) {
    const { postId } = query;
    const post = await this.prisma.post.findUnique({
      where: { id: postId, ...this.isNotDelete },
      select: {
        ...this.postHelper.getPostFields(),
        user: { select: { ...this.postHelper.getPostUserFields() } },
        medias: { where: this.isNotDelete, select: { ...this.postHelper.getPostMediaFields() } },
      },
    });
    return post;
  }

  async creatPost(files: Express.Multer.File[], post: PostDto) {
    const {} = post;
  }
}
