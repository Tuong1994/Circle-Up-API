import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import responseMessage from '../message';

const { NO_ID, NOT_FOUND } = responseMessage;

@Injectable()
export class CheckIdMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly model: string,
    private readonly validateField?: string,
  ) {
    this.use = this.use.bind(this);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const {
      ids,
      userId,
      userInfoId,
      userWorkId,
      userEducationId,
      userLivedId,
      postId,
      friendId,
      eventId,
      albumId,
      savedId,
      collectionId,
      followId,
      followerId,
      followedId,
      commentId,
      likeId,
      mediaId,
      cityId,
      districtId,
      wardId,
    } = req.query;

    if (
      !ids &&
      !userId &&
      !userInfoId &&
      !userWorkId &&
      !userEducationId &&
      !userLivedId &&
      !postId &&
      !friendId &&
      !eventId &&
      !followId &&
      !followerId &&
      !followedId &&
      !commentId &&
      !likeId &&
      !mediaId &&
      !albumId &&
      !savedId &&
      !collectionId &&
      !cityId &&
      !districtId &&
      !wardId
    ) {
      throw new HttpException(NO_ID, HttpStatus.BAD_REQUEST);
    }

    if (ids) return next();

    const checkedField = this.validateField ? this.validateField : 'id';

    const record = await this.prisma[this.model].findUnique({
      where: {
        [checkedField]: String(
          userId ||
            userInfoId ||
            userWorkId ||
            userEducationId ||
            userLivedId ||
            postId ||
            friendId ||
            eventId ||
            followId ||
            followerId ||
            followedId ||
            commentId ||
            likeId ||
            mediaId ||
            albumId ||
            savedId ||
            collectionId ||
            cityId ||
            districtId ||
            wardId,
        ),
        isDelete: { equals: false },
      },
    });

    if (!record) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    next();
  }
}
