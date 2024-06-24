import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Query,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { EventDto } from './event.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { RoleGuard } from 'src/common/guard/role.guard';

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
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createEvent(@Body() event: EventDto) {
    return this.eventService.createEvent(event);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateEvent(@Query() query: QueryDto, @Body() event: EventDto) {
    return this.eventService.updateEvent(query, event);
  }

  @Delete('remove')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeEvents(@Query() query: QueryDto) {
    return this.eventService.removeEvents(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeEventsPermanent(@Query() query: QueryDto) {
    return this.eventService.removeEventsPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreEvents() {
    return this.eventService.restoreEvents();
  }
}
