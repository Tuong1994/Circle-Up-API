import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging, List } from 'src/common/type/base';
import { Comment } from '@prisma/client';
import { CommentDto } from './comment.dto';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE, REMOVE, NOT_FOUND, NO_DATA_RESTORE, RESTORE } = responseMessage;

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  private isNotDelete = { isDelete: { equals: false } };

  async getComments(query: QueryDto) {
    const { limit, postId, sortBy } = query;
    let collection: List<Comment> = utils.defaultList();
    const comments = await this.prisma.comment.findMany({
      where: { AND: [{ postId }, { ...this.isNotDelete }] },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    if (comments && comments.length > 0) {
      const totalItems = comments.length;
      const items = comments.slice(0, Number(limit));
      collection = { totalItems, items };
    }
    return collection;
  }

  async getCommentsByUser(query: QueryDto) {
    const { page, limit, userId, sortBy } = query;
    let collection: Paging<Comment> = utils.defaultCollection();
    const comments = await this.prisma.comment.findMany({
      where: { userId, ...this.isNotDelete },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    if (comments && comments.length > 0) collection = utils.paging<Comment>(comments, page, limit);
    return collection;
  }

  async getComment(query: QueryDto) {
    const { commentId } = query;
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId, ...this.isNotDelete },
    });
    return comment;
  }

  async createComment(comment: CommentDto) {
    const { content, userId, postId, parentId } = comment;
    const newComment = await this.prisma.comment.create({
      data: { content, userId, postId, parentId, isDelete: false },
    });
    return newComment;
  }

  async updateComment(query: QueryDto, comment: CommentDto) {
    const { commentId } = query;
    const { content, userId, postId, parentId } = comment;
    await this.prisma.comment.update({
      where: { id: commentId },
      data: { content, userId, postId, parentId },
    });
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async removeComments(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const comments = await this.prisma.comment.findMany({ where: { id: { in: listIds } } });
    if (comments && !comments.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.comment.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async removeCommentsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const comments = await this.prisma.comment.findMany({ where: { id: { in: listIds } } });
    if (comments && !comments.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.comment.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async restoreComments() {
    const comments = await this.prisma.comment.findMany({ where: { isDelete: { equals: true } } });
    if (comments && !comments.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      comments.map(async (comment) => {
        await this.prisma.comment.update({ where: { id: comment.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException(RESTORE, HttpStatus.OK);
  }
}
