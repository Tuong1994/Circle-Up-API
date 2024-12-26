import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Post } from '@prisma/client';
import { PostHelper } from './post.helper';
import { PostDto } from './post.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import utils from 'src/utils';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private postHelper: PostHelper,
    private cloudinary: CloudinaryService,
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

  async creatPost(query: QueryDto, files: Express.Multer.File[], post: PostDto) {
    const { fileType } = query;
    const { content, feeling, cityCode, audience, userId } = post;
    const newPost = await this.prisma.post.create({
      data: { content, feeling, cityCode, audience, userId, isDelete: false },
      select: { ...this.postHelper.getPostFields() },
    });
    if (!files) return newPost;
    if (Array.isArray(files) && files.length > 0) {
      const medias = await Promise.all(
        files.map(async (file) => {
          const result = await this.cloudinary.upload(utils.getFileUrl(file));
          const generateFile = utils.generateFile(result, fileType, { postId: newPost.id });
          return generateFile;
        }),
      );
      await this.prisma.media.createMany({ data: medias });
      const postWithMedia = await this.prisma.post.findUnique({
        where: { id: newPost.id },
        select: {
          ...this.postHelper.getPostFields(),
          medias: {
            select: { ...this.postHelper.getPostMediaFields() },
          },
        },
      });
      return postWithMedia;
    }
  }

  async updatePost(query: QueryDto, files: Express.Multer.File[], post: PostDto) {
    const { postId, fileType } = query;
    const { content, feeling, cityCode, audience, userId } = post;
    await this.prisma.post.update({
      where: { id: postId },
      data: { content, feeling, cityCode, audience, userId },
    });
    if (!files) throw new HttpException('Updated success', HttpStatus.OK);
    if (Array.isArray(files) && files.length > 0) {
    }
  }
}
