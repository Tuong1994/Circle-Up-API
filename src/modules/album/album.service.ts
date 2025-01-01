import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Album } from '@prisma/client';
import { AlbumDto } from './album.dto';
import { MediaHelper } from '../media/media.helper';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE, REMOVE, RESTORE, NOT_FOUND, NO_DATA_RESTORE } = responseMessage;

@Injectable()
export class AlbumService {
  constructor(
    private prisma: PrismaService,
    private mediaHelper: MediaHelper,
    private cloudinary: CloudinaryService,
  ) {}

  private isNotDelete = { isDelete: { equals: false } };

  async getAlbums(query: QueryDto) {
    const { page, limit, keywords, sortBy } = query;
    let collection: Paging<Album> = utils.defaultCollection();
    const albums = await this.prisma.album.findMany({
      where: this.isNotDelete,
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      include: { medias: { select: { id: true } } },
    });
    if (keywords) {
      const filterAlbums = albums.filter((album) => utils.filterByKeywords(album.name, keywords));
      collection = utils.paging<Album>(filterAlbums, page, limit);
    } else collection = utils.paging<Album>(albums, page, limit);
    return collection;
  }

  async getAlbum(query: QueryDto) {
    const { albumId } = query;
    const album = await this.prisma.album.findUnique({
      where: { id: albumId, ...this.isNotDelete },
      include: { medias: { select: { id: true } } },
    });
    return album;
  }

  async createAlbum(query: QueryDto, album: AlbumDto, files: Express.Multer.File[]) {
    const { fileType } = query;
    const { name, description, audience, feeling, cityCode, authorId, tags } = album;
    const newAlbum = await this.prisma.album.create({
      data: { name, description, audience, feeling, cityCode, authorId },
    });
    const newPost = await this.prisma.post.create({
      data: { content: description, audience, feeling, cityCode, userId: authorId },
    });
    if (files && files.length > 0) {
      const medias = await Promise.all(
        files.map(async (file) => {
          const { existMedia, fileHash } = await this.mediaHelper.getExistedMedia(file);
          if (existMedia) return;
          const result = await this.cloudinary.upload(utils.getFileUrl(file));
          const generateFile = utils.generateFile(result, {
            albumId: newAlbum.id,
            postId: newPost.id,
            type: fileType,
            hash: fileHash,
          });
          return generateFile;
        }),
      );
      await this.prisma.media.createMany({ data: medias });
    }
    if (tags && tags.length > 0) {
      await Promise.all(
        tags.map(async (tag) => {
          await this.prisma.albumOnUser.create({ data: { userId: tag.userId, albumId: newAlbum.id } });
          await this.prisma.postOnUser.create({ data: { userId: tag.userId, postId: newPost.id } });
        }),
      );
    }
    const albumWithMediasAndTags = await this.prisma.album.findUnique({
      where: { id: newAlbum.id },
      include: { tags: true, medias: { select: { ...this.mediaHelper.getMediaFields() } } },
    });
    return albumWithMediasAndTags;
  }

  async updateAlbum(query: QueryDto, album: AlbumDto, files: Express.Multer.File[]) {
    const { fileType, albumId } = query;
    const { name, description, audience, feeling, cityCode, authorId, postId, tags } = album;
    await this.prisma.album.update({
      where: { id: albumId },
      data: { name, description, audience, feeling, cityCode, authorId },
    });
    await this.prisma.post.update({
      where: { id: postId },
      data: { content: description, audience, feeling, cityCode, userId: authorId },
    });
    if (files && files.length > 0) {
      const medias = await Promise.all(
        files.map(async (file) => {
          const { existMedia, fileHash } = await this.mediaHelper.getExistedMedia(file);
          if (existMedia) return;
          const result = await this.cloudinary.upload(utils.getFileUrl(file));
          const generateFile = utils.generateFile(result, {
            albumId,
            postId,
            type: fileType,
            hash: fileHash,
          });
          return generateFile;
        }),
      );
      await this.prisma.media.createMany({ data: medias });
    }
    if (tags && tags.length > 0) {
      await Promise.all(
        tags.map(async (tag) => {
          await this.prisma.albumOnUser.create({ data: { userId: tag.userId, albumId } });
          await this.prisma.postOnUser.create({ data: { userId: tag.userId, postId } });
        }),
      );
    }
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async removeAlbums(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const albums = await this.prisma.album.findMany({ where: { id: { in: listIds } } });
    if (albums && !albums.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.album.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      albums.map(async (album) => {
        await this.prisma.media.updateMany({ where: { albumId: album.id }, data: { isDelete: true } });
      }),
    );
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async removeAlbumsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const albums = await this.prisma.album.findMany({ where: { id: { in: listIds } } });
    if (albums && !albums.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.album.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async restoreAlbums() {
    const albums = await this.prisma.album.findMany({ where: { isDelete: { equals: true } } });
    if (albums && !albums.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      albums.map(async (album) => {
        await this.prisma.album.update({ where: { id: album.id }, data: { isDelete: false } });
        await this.prisma.media.updateMany({ where: { albumId: album.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException(RESTORE, HttpStatus.OK);
  }
}
