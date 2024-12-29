import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { EventDto } from './event.dto';
import { Paging } from 'src/common/type/base';
import { Event } from '@prisma/client';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE, REMOVE, RESTORE, NOT_FOUND, NO_DATA_RESTORE } = responseMessage;

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  private isNotDelete = { isDelete: { equals: false } };

  async getEvents(query: QueryDto) {
    const { page, limit, sortBy, keywords } = query;
    let collection: Paging<Event> = utils.defaultCollection();
    const events = await this.prisma.event.findMany({
      where: { AND: [{ ...this.isNotDelete }] },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords) {
      const filterEvents = events.filter((event) => utils.filterByKeywords(event.title, keywords));
      collection = utils.paging<Event>(filterEvents, page, limit);
    } else collection = utils.paging<Event>(events, page, limit);
    return collection;
  }

  async getEvent(query: QueryDto) {
    const { eventId } = query;
    const event = await this.prisma.event.findUnique({ where: { id: eventId, ...this.isNotDelete } });
    return event;
  }

  async createEvent(event: EventDto) {
    const { title, description, date, creatorId } = event;
    const newEvent = await this.prisma.event.create({
      data: { title, description, date, creatorId, isDelete: false },
    });
    return newEvent;
  }

  async updateEvent(query: QueryDto, event: EventDto) {
    const { eventId } = query;
    const { title, description, date, creatorId } = event;
    await this.prisma.event.update({ where: { id: eventId }, data: { title, description, date, creatorId } });
    throw new HttpException(UPDATE, HttpStatus.OK);
  }

  async removeEvents(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const events = await this.prisma.event.findMany({ where: { id: { in: listIds } } });
    if (events && !events.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.event.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async removeEventsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const events = await this.prisma.event.findMany({ where: { id: { in: listIds } } });
    if (events && !events.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.event.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE, HttpStatus.OK);
  }

  async restoreEvents() {
    const events = await this.prisma.event.findMany({ where: { isDelete: true } });
    if (events && !events.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      events.map(async (event) => {
        await this.prisma.event.update({ where: { id: event.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException(RESTORE, HttpStatus.OK);
  }
}
