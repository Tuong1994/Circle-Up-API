import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PostWithPayload } from './post.type';
import utils from 'src/utils';

@Injectable()
export class PostHelper {
  constructor(private prisma: PrismaService) {}

  getPostFields(): Prisma.PostSelect {
    return {
      id: true,
      content: true,
      audience: true,
      feeling: true,
      cityCode: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  getPostUserFields(): Prisma.UserSelect {
    return {
      id: true,
      firstName: true,
      lastName: true,
    };
  }

  getPostMediaFields(): Prisma.MediaSelect {
    return {
      id: true,
      path: true,
      publicId: true,
      size: true,
      type: true,
      hash: true,
    };
  }

  getPostTagFields(): Prisma.PostOnUserSelect {
    return { userId: true };
  }

  async handleUpdateIsDeletePostComments(post: PostWithPayload, isDelete: boolean) {
    await this.prisma.comment.updateMany({ where: { postId: post.id }, data: { isDelete } });
  }

  async handleUpdateIsDeletePostLikes(post: PostWithPayload, isDelete: boolean) {
    await this.prisma.like.updateMany({ where: { postId: post.id }, data: { isDelete } });
  }

  async handleUpdateIsDeletePostFollowers(post: PostWithPayload, isDelete: boolean) {
    await this.prisma.follow.updateMany({ where: { postId: post.id }, data: { isDelete } });
  }

  async handleUpdateIsDeletePostMedias(post: PostWithPayload, isDelete: boolean) {
    await this.prisma.media.updateMany({ where: { postId: post.id }, data: { isDelete } });
  }

  async handleUpdateIsDeletePostTags(post: PostWithPayload, isDelete: boolean) {
    await this.prisma.postOnUser.updateMany({ where: { postId: post.id }, data: { isDelete } });
  }
}
