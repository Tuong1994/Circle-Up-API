import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Saved } from '@prisma/client';
import { SavedDto } from './saved.dto';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE, REMOVE, RESTORE, NOT_FOUND, NO_DATA_RESTORE } = responseMessage;

@Injectable()
export class SavedService {
  constructor(private prisma: PrismaService) {}

  private isNotDelete = { isDelete: { equals: false } };

  async getSavedList(query: QueryDto) {
    const { page, limit, sortBy } = query;
    const savedList = await this.prisma.saved.findMany({
      where: this.isNotDelete,
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      include: { posts: true },
    });
    const collection = utils.paging<Saved>(savedList, page, limit);
    return collection;
  }

  async getSaved(query: QueryDto) {
    const { savedId } = query;
    const saved = await this.prisma.saved.findUnique({ where: { id: savedId }, include: { posts: true } });
    return saved;
  }

  async createSaved(saved: SavedDto) {
    const { userId, postId } = saved;
    const newSaved = await this.prisma.saved.create({ data: { userId } });
    await this.prisma.post.update({ where: { id: postId }, data: { savedId: newSaved.id } });
    const savedWithPosts = await this.prisma.saved.findUnique({
      where: { id: newSaved.id },
      include: { posts: true },
    });
    return savedWithPosts;
  }

  async updateSaved(query: QueryDto, saved: SavedDto) {
    const { savedId } = query;
    const { userId, postId } = saved;
    await this.prisma.saved.update({ where: { id: savedId }, data: { userId } });
    await this.prisma.post.update({ where: { id: postId }, data: { savedId } });
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async removeSavedList(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const savedList = await this.prisma.saved.findMany({ where: { id: { in: listIds } } });
    if (savedList && !savedList.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.saved.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async removeSavedListPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const savedList = await this.prisma.saved.findMany({ where: { id: { in: listIds } } });
    if (savedList && !savedList.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.saved.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async restoreSavedList() {
    const savedList = await this.prisma.saved.findMany({ where: { isDelete: true } });
    if (savedList && !savedList.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      savedList.map(async (saved) => {
        await this.prisma.saved.update({ where: { id: saved.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException(RESTORE, HttpStatus.OK);
  }
}
