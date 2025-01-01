import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Collection } from '@prisma/client';
import { CollectionDto } from './collection.dto';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { CREATE, UPDATE, REMOVE, RESTORE, NOT_FOUND, NO_DATA_RESTORE } = responseMessage;

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  private isNotDelete = { isDelete: { equals: false } };

  async getCollections(query: QueryDto) {
    const { page, limit, keywords, sortBy } = query;
    let collection: Paging<Collection> = utils.defaultCollection();
    const collections = await this.prisma.collection.findMany({
      where: this.isNotDelete,
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      include: { posts: true },
    });
    if (keywords) {
      const filterCollections = collections.filter((collection) =>
        utils.filterByKeywords(collection.name, keywords),
      );
      collection = utils.paging<Collection>(filterCollections, page, limit);
    } else collection = utils.paging<Collection>(collections, page, limit);
    return collection;
  }

  async getCollection(query: QueryDto) {
    const { collectionId } = query;
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
      include: { posts: true },
    });
    return collection;
  }

  async createCollection(collection: CollectionDto) {
    const { name, userId, postId } = collection;
    const newCollection = await this.prisma.collection.create({ data: { name, userId } });
    await this.prisma.post.update({ where: { id: postId }, data: { collectionId: newCollection.id } });
    const collectionWithSaved = await this.prisma.collection.findUnique({
      where: { id: newCollection.id },
      include: { posts: true },
    });
    return collectionWithSaved;
  }

  async createCollectionItem(query: QueryDto, collection: CollectionDto) {
    const { collectionId } = query;
    const { postId } = collection;
    await this.prisma.post.update({ where: { id: postId }, data: { collectionId } });
    throw new HttpException(CREATE, HttpStatus.OK);
  }

  async updateCollection(query: QueryDto, collection: CollectionDto) {
    const { collectionId } = query;
    const { name, userId } = collection;
    await this.prisma.collection.update({ where: { id: collectionId }, data: { name, userId } });
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async removeCollections(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const collections = await this.prisma.collection.findMany({ where: { id: { in: listIds } } });
    if (collections && !collections.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.collection.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async removeCollectionsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const collections = await this.prisma.collection.findMany({ where: { id: { in: listIds } } });
    if (collections && !collections.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.collection.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async restoreCollections() {
    const collections = await this.prisma.collection.findMany({ where: { isDelete: { equals: true } } });
    if (collections && !collections.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      collections.map(async (collection) => {
        await this.prisma.collection.update({ where: { id: collection.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException(RESTORE, HttpStatus.OK);
  }
}
