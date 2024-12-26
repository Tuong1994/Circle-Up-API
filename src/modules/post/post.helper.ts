import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import utils from '../../utils';

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

  async getExistedMedia(file: Express.Multer.File) {
    const fileHash = utils.generateFileHash(file);
    const existMedia = await this.prisma.media.findUnique({
      where: { hash: fileHash },
      select: { ...this.getPostMediaFields() },
    });
    return { fileHash, existMedia };
  }
}
