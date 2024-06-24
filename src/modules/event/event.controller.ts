import { Body, Controller, Get, Post, HttpCode, HttpStatus, Query, Put, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { EventDto } from './event.dto';

@Controller('api/event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getEvents(@QueryPaging() query: QueryDto) {
    return this.eventService.getEvents(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getEvent(@Query() query: QueryDto) {
    return this.eventService.getEvent(query);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createEvent(@Body() event: EventDto) {
    return this.eventService.createEvent(event);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  updateEvent(@Query() query: QueryDto, @Body() event: EventDto) {
    return this.eventService.updateEvent(query, event);
  }

  @Delete('remove')
  @HttpCode(HttpStatus.OK)
  removeEvents(@Query() query: QueryDto) {
    return this.eventService.removeEvents(query);
  }

  @Delete('removePermanent')
  @HttpCode(HttpStatus.OK)
  removeEventsPermanent(@Query() query: QueryDto) {
    return this.eventService.removeEventsPermanent(query);
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  restoreEvents() {
    return this.eventService.restoreEvents();
  }
}
