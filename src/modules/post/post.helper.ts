import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostHelper {
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
    };
  }
}
