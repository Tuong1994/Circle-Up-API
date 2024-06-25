import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Post } from '@prisma/client';
import { PostDto } from './post.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { EMediaType } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getPosts(query: QueryDto) {
    const { page, limit, sortBy } = query;
    let collection: Paging<Post> = utils.defaultCollection();
    const posts = await this.prisma.post.findMany({
      where: {
        AND: [{ isDelete: { equals: false } }],
      },
      include: { medias: true },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    collection = utils.paging<Post>(posts, page, limit);
    return collection;
  }

  async getPost(query: QueryDto) {
    const { postId } = query;
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    return post;
  }

  async createPost(query: QueryDto, files: Express.Multer.File[], post: PostDto) {
    const { video } = query;
    const { content, userId } = post;
    const newPost = await this.prisma.post.create({
      data: { content, userId, isDelete: false },
      include: { medias: true },
    });
    if (!newPost) throw new HttpException('Create failed', HttpStatus.BAD_REQUEST);
    if (!files.length) return newPost;
    await Promise.all(
      files.map(async (file) => {
        const result = await this.cloudinary.upload(utils.getFileUrl(file));
        const mediaType = video ? EMediaType.VIDEO : EMediaType.IMAGE;
        const media = utils.generateFile(result, { postId: newPost.id }, mediaType);
        await this.prisma.media.create({ data: { ...media, isDelete: false } });
      }),
    );
    return newPost;
  }

  async updatePost(query: QueryDto, files: Express.Multer.File[], post: PostDto) {
    const { postId, video } = query;
    const { content, userId } = post;
    await this.prisma.post.update({ where: { id: postId }, data: { content, userId } });
    if (!files.length) throw new HttpException('Updated success', HttpStatus.OK);
    await Promise.all(
      files.map(async (file) => {
        const result = await this.cloudinary.upload(utils.getFileUrl(file));
        const mediaType = video ? EMediaType.VIDEO : EMediaType.IMAGE;
        const media = utils.generateFile(result, { postId }, mediaType);
        await this.prisma.media.create({ data: { ...media, isDelete: false } });
      }),
    );
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removePosts(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const posts = await this.prisma.post.findMany({
      where: { id: { in: listIds } },
      select: { id: true, medias: true, comments: true, likes: true },
    });
    if (posts && !posts.length) throw new HttpException('Posts not found', HttpStatus.NOT_FOUND);
    await this.prisma.post.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      posts.map(async (post) => {
        if (post.medias.length > 0)
          await this.prisma.media.updateMany({ where: { postId: post.id }, data: { isDelete: true } });
        if (post.comments.length > 0)
          await this.prisma.comment.updateMany({ where: { postId: post.id }, data: { isDelete: true } });
        if (post.likes.length > 0)
          await this.prisma.like.updateMany({ where: { postId: post.id }, data: { isDelete: true } });
      }),
    );
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removePostsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const posts = await this.prisma.post.findMany({
      where: { id: { in: listIds } },
      include: { medias: true },
    });
    if (posts && !posts.length) throw new HttpException('Posts not found', HttpStatus.NOT_FOUND);
    await this.prisma.post.deleteMany({ where: { id: { in: listIds } } });
    posts.map(async (post) => {
      await Promise.all(
        post.medias?.map(async (media) => {
          if (!media) return;
          await this.cloudinary.destroy(media.publicId);
        }),
      );
    });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restorePosts() {
    const posts = await this.prisma.post.findMany({
      where: { isDelete: { equals: true } },
      select: { id: true, medias: true, likes: true, comments: true },
    });
    if (posts && !posts.length) throw new HttpException('There are no data to restored', HttpStatus.OK);
    await Promise.all(
      posts.map(async (post) => {
        await this.prisma.post.updateMany({ where: { id: post.id }, data: { isDelete: false } });
        if (post.medias.length > 0)
          await this.prisma.media.updateMany({ where: { postId: post.id }, data: { isDelete: false } });
        if (post.comments.length > 0)
          await this.prisma.comment.updateMany({ where: { postId: post.id }, data: { isDelete: false } });
        if (post.likes.length > 0)
          await this.prisma.like.updateMany({ where: { postId: post.id }, data: { isDelete: false } });
      }),
    );
  }
}
