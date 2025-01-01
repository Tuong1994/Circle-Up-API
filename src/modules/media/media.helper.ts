import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import utils from 'src/utils';

@Injectable()
export class MediaHelper {
  constructor(private prisma: PrismaService) {}

  getMediaFields(): Prisma.MediaSelect {
    return {
      id: true,
      path: true,
      publicId: true,
      size: true,
      type: true,
      hash: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  async getExistedMedia(file: Express.Multer.File) {
    const fileHash = utils.generateFileHash(file);
    const existMedia = await this.prisma.media.findUnique({
      where: { hash: fileHash },
      select: { ...this.getMediaFields() },
    });
    return { fileHash, existMedia };
  }
}
