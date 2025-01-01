import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { FriendDto } from './friend.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';

@Controller('api/friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Get('list')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getFriends(@QueryPaging() query: QueryDto) {
    return this.friendService.getFriends(query);
  }

  @Get('detail')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getFriend(@Query() query: QueryDto) {
    return this.friendService.getFriend(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createFriend(@Body() friend: FriendDto) {
    return this.friendService.createFriend(friend);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateFriend(@Query() query: QueryDto, @Body() friend: FriendDto) {
    return this.friendService.updateFriend(query, friend);
  }

  @Delete('remove')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeFriends(query: QueryDto) {
    return this.friendService.removeFriends(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeFriendsPermanent(query: QueryDto) {
    return this.friendService.removeFriendsPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreFriends() {
    return this.friendService.restoreFriends();
  }
}
