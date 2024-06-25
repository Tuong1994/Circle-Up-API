import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Paging } from 'src/common/type/base';
import { Media } from '@prisma/client';
import { EMediaType } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getMedias(query: QueryDto) {
    const { page, limit } = query;
    let collection: Paging<Media> = utils.defaultCollection();
    const medias = await this.prisma.media.findMany({ where: { isDelete: { equals: false } } });
    if (medias && medias.length > 0) collection = utils.paging<Media>(medias, page, limit);
    return collection;
  }

  async userUpload(query: QueryDto, file: Express.Multer.File) {
    const { userId } = query;
    if (!userId) throw new HttpException('User ID is missing', HttpStatus.BAD_REQUEST);
    if (!file) throw new HttpException('File is not provided', HttpStatus.BAD_REQUEST);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });
    const result = await this.cloudinary.upload(utils.getFileUrl(file));
    const image = utils.generateFile(result, { userId }, EMediaType.IMAGE);
    if (user && user.image) {
      await this.cloudinary.destroy(user.image.publicId);
      await this.prisma.media.update({ where: { userId }, data: image });
    } else {
      await this.prisma.media.create({ data: { ...image, isDelete: false } });
    }
    throw new HttpException('Uploaded success', HttpStatus.OK);
  }

  async postUpload(query: QueryDto, files: Express.Multer.File[]) {
    const { postId, video } = query;
    if (!postId) throw new HttpException('User ID is missing', HttpStatus.BAD_REQUEST);
    if (!files) throw new HttpException('File is not provided', HttpStatus.BAD_REQUEST);
    if (!files.length) throw new HttpException('File is not provided', HttpStatus.BAD_REQUEST);
    await Promise.all(
      files.map(async (file) => {
        const result = await this.cloudinary.upload(utils.getFileUrl(file));
        const mediaType = video ? EMediaType.VIDEO : EMediaType.IMAGE;
        const media = utils.generateFile(result, { postId }, mediaType);
        await this.prisma.media.create({ data: { ...media, isDelete: false } });
      }),
    );
    throw new HttpException('Uploaded success', HttpStatus.OK);
  }

  async removeMedias(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const medias = await this.prisma.media.findMany({ where: { id: { in: listIds } } });
    if (medias && !medias.length) throw new HttpException('Media not found', HttpStatus.NOT_FOUND);
    await this.prisma.media.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeMediasPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const medias = await this.prisma.media.findMany({ where: { id: { in: listIds } } });
    if (medias && !medias.length) throw new HttpException('Media not found', HttpStatus.NOT_FOUND);
    await Promise.all(medias.map((media) => this.cloudinary.destroy(media.publicId)));
    await this.prisma.media.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restoreMedias() {
    await this.prisma.media.updateMany({ data: { isDelete: false } });
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
