import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { Paging } from 'src/common/type/base';
import { Friend } from '@prisma/client';
import { FriendDto } from './friend.dto';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE, REMOVE, RESTORE, NOT_FOUND, NO_DATA_RESTORE } = responseMessage;

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  private isNotDelete = { isDelete: { equals: false } };

  async getFriends(query: QueryDto) {
    const { page, limit, keywords, sortBy } = query;
    let collection: Paging<Friend> = utils.defaultCollection();
    const friends = await this.prisma.friend.findMany({
      where: this.isNotDelete,
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      include: { receiver: true, requester: true },
    });
    if (keywords) {
      const filterFriends = friends.filter(
        (friend) =>
          utils.filterByKeywords(friend.receiver.fullName, keywords) ||
          utils.filterByKeywords(friend.requester.fullName, keywords),
      );
      collection = utils.paging<Friend>(filterFriends, page, limit);
    } else collection = utils.paging<Friend>(friends, page, limit);
    return collection;
  }

  async getFriend(query: QueryDto) {
    const { friendId } = query;
    const friend = await this.prisma.friend.findUnique({ where: { id: friendId, ...this.isNotDelete } });
    return friend;
  }

  async createFriend(friend: FriendDto) {
    const { status, receiverId, requesterId } = friend;
    const newFriend = await this.prisma.friend.create({ data: { status, receiverId, requesterId } });
    return newFriend;
  }

  async updateFriend(query: QueryDto, friend: FriendDto) {
    const { friendId } = query;
    const { status, receiverId, requesterId } = friend;
    await this.prisma.friend.update({ where: { id: friendId }, data: { status, receiverId, requesterId } });
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async removeFriends(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const friends = await this.prisma.friend.findMany({ where: { id: { in: listIds } } });
    if (friends && !friends.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.friend.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async removeFriendsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const friends = await this.prisma.friend.findMany({ where: { id: { in: listIds } } });
    if (friends && !friends.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.friend.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async restoreFriends() {
    const friends = await this.prisma.friend.findMany({ where: { isDelete: { equals: true } } });
    if (friends && !friends) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      friends.map(async (friend) => {
        await this.prisma.friend.update({ where: { id: friend.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException(RESTORE, HttpStatus.OK);
  }
}
