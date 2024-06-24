import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { EventDto } from './event.dto';
import { Paging } from 'src/common/type/base';
import { Event } from '@prisma/client';
import utils from 'src/utils';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getEvents(query: QueryDto) {
    const { page, limit, sortBy, keywords } = query;
    let collection: Paging<Event> = utils.defaultCollection();
    const events = await this.prisma.event.findMany({
      where: {
        AND: [{ isDelete: { equals: false } }],
      },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
    });
    if (keywords) {
      const filterEvents = events.filter((event) =>
        event.title.toLowerCase().includes(keywords.toLowerCase()),
      );
      collection = utils.paging<Event>(filterEvents, page, limit);
    } else collection = utils.paging<Event>(events, page, limit);
    return collection;
  }

  async getEvent(query: QueryDto) {
    const { eventId } = query;
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
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
    throw new HttpException('Updated success', HttpStatus.OK);
  }

  async removeEvents(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const events = await this.prisma.event.findMany({ where: { id: { in: listIds } } });
    if (events && !events.length) throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    await this.prisma.event.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async removeEventsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const events = await this.prisma.event.findMany({ where: { id: { in: listIds } } });
    if (events && !events.length) throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    await this.prisma.event.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException('Removed success', HttpStatus.OK);
  }

  async restoreEvents() {
    const events = await this.prisma.event.findMany({ where: { isDelete: true } });
    if (events && !events.length) throw new HttpException('There are no data to restored', HttpStatus.OK);
    await Promise.all(
      events.map(async (event) => {
        await this.prisma.event.update({ where: { id: event.id }, data: { isDelete: false } });
      }),
    );
    throw new HttpException('Restored success', HttpStatus.OK);
  }
}
