import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Post } from '@prisma/client';
import { PostHelper } from './post.helper';
import { PostDto } from './post.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import utils from '../../utils';

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
      where: { AND: [{ ...this.isNotDelete }] },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: {
        ...this.postHelper.getPostFields(),
        user: { select: { ...this.postHelper.getPostUserFields() } },
        tags: { select: { ...this.postHelper.getPostTagFields() } },
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
        tags: { select: { ...this.postHelper.getPostTagFields() } },
        medias: { where: this.isNotDelete, select: { ...this.postHelper.getPostMediaFields() } },
      },
    });
    return post;
  }

  async creatPost(query: QueryDto, files: Express.Multer.File[], post: PostDto) {
    const { fileType } = query;
    const { content, feeling, cityCode, audience, userId } = post;
    const newPost = await this.prisma.post.create({
      data: {
        content,
        userId,
        feeling: Number(feeling),
        cityCode: Number(cityCode),
        audience: Number(audience),
        isDelete: false,
      },
      select: { ...this.postHelper.getPostFields() },
    });
    if (!files || !files.length) return newPost;
    await Promise.all(
      files.map(async (file) => {
        const { existMedia, fileHash } = await this.postHelper.getExistedMedia(file);
        if (existMedia) return;
        const result = await this.cloudinary.upload(utils.getFileUrl(file));
        const generateFile = utils.generateFile(result, {
          postId: newPost.id,
          type: fileType,
          hash: fileHash,
        });
        await this.prisma.media.create({ data: generateFile });
      }),
    );
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

  async updatePost(query: QueryDto, files: Express.Multer.File[], post: PostDto) {
    const { postId, fileType } = query;
    const { content, feeling, cityCode, audience, userId } = post;
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        content,
        userId,
        feeling: Number(feeling),
        cityCode: Number(cityCode),
        audience: Number(audience),
      },
    });
    if (!files || !files.length) throw new HttpException('Updated success', HttpStatus.OK);
    await Promise.all(
      files.map(async (file) => {
        const { existMedia, fileHash } = await this.postHelper.getExistedMedia(file);
        if (existMedia) return;
        const result = await this.cloudinary.upload(utils.getFileUrl(file));
        const generateFile = utils.generateFile(result, {
          postId,
          type: fileType,
          hash: fileHash,
        });
        await this.prisma.media.create({ data: generateFile });
      }),
    );
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removePosts(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const posts = await this.prisma.post.findMany({
      where: { id: { in: listIds } },
      select: { id: true, medias: true, comments: true, likes: true, tags: true, followers: true },
    });
    if (posts && !posts.length) throw new HttpException('Posts not found', HttpStatus.NOT_FOUND);
    await this.prisma.post.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      posts.map(async (post) => {
        if (post.comments.length > 0) await this.postHelper.handleUpdateIsDeletePostComments(post, true);
        if (post.followers.length > 0) await this.postHelper.handleUpdateIsDeletePostFollowers(post, true);
        if (post.likes.length > 0) await this.postHelper.handleUpdateIsDeletePostLikes(post, true);
        if (post.medias.length > 0) await this.postHelper.handleUpdateIsDeletePostMedias(post, true);
      }),
    );
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removePostsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const posts = await this.prisma.post.findMany({ where: { id: { in: listIds } } });
    if (posts && !posts.length) throw new HttpException('Posts not found', HttpStatus.NOT_FOUND);
    await this.prisma.post.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restorePosts() {
    const posts = await this.prisma.post.findMany({
      where: { isDelete: { equals: true } },
      select: { id: true, medias: true, comments: true, likes: true, tags: true, followers: true },
    });
    if (posts && !posts.length) throw new HttpException('No data to restore', HttpStatus.OK);
    await Promise.all(
      posts.map(async (post) => {
        await this.prisma.post.update({ where: { id: post.id }, data: { isDelete: false } });
        if (post.comments.length > 0) await this.postHelper.handleUpdateIsDeletePostComments(post, false);
        if (post.followers.length > 0) await this.postHelper.handleUpdateIsDeletePostFollowers(post, false);
        if (post.likes.length > 0) await this.postHelper.handleUpdateIsDeletePostLikes(post, false);
        if (post.medias.length > 0) await this.postHelper.handleUpdateIsDeletePostMedias(post, false);
      }),
    );
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
