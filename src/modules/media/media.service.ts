import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MediaHelper } from './media.helper';
import { QueryDto } from 'src/common/dto/query.dto';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { NO_FILE } = responseMessage;

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private mediaHelper: MediaHelper,
    private cloudinary: CloudinaryService,
  ) {}

  async userUpload(query: QueryDto, files: Express.Multer.File[]) {
    const { userId, fileType } = query;
    if (files && !files.length) throw new HttpException(NO_FILE, HttpStatus.BAD_REQUEST);
    const medias = await Promise.all(
      files.map(async (file) => {
        const { existMedia, fileHash } = await this.mediaHelper.getExistedMedia(file);
        if (existMedia) return;
        const result = await this.cloudinary.upload(utils.getFileUrl(file));
        const generateFile = utils.generateFile(result, { userId, type: fileType, hash: fileHash });
        return generateFile;
      }),
    );
    const newMedias = await this.prisma.media.createMany({ data: medias });
    return newMedias;
  }

  async postUpload(query: QueryDto, files: Express.Multer.File[]) {
    const { postId, fileType } = query;
    if (files && !files.length) throw new HttpException(NO_FILE, HttpStatus.BAD_REQUEST);
    const medias = await Promise.all(
      files.map(async (file) => {
        const { existMedia, fileHash } = await this.mediaHelper.getExistedMedia(file);
        if (existMedia) return;
        const result = await this.cloudinary.upload(utils.getFileUrl(file));
        const generateFile = utils.generateFile(result, { postId, type: fileType, hash: fileHash });
        return generateFile;
      }),
    );
    const newMedias = await this.prisma.media.createMany({ data: medias });
    return newMedias;
  }
}
