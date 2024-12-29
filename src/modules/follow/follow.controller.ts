import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { FollowDto } from './follow.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';

@Controller('api/follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Get('list')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getFollows(@QueryPaging() query: QueryDto) {
    return this.followService.getFollows(query);
  }

  @Get('detail')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getFollow(@Query() query: QueryDto) {
    return this.followService.getFollow(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createFollow(@Body() follow: FollowDto) {
    return this.followService.createFollow(follow);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateFollow(@Query() query: QueryDto, @Body() follow: FollowDto) {
    return this.followService.updateFollow(query, follow);
  }

  @Post('remove')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeFollows(@Query() query: QueryDto) {
    return this.followService.removeFollows(query);
  }

  @Post('removePermanent')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeFollowsPermanent(@Query() query: QueryDto) {
    return this.followService.removeFollowsPermanent(query);
  }

  @Post('restore')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  restoreFollows() {
    return this.followService.restoreFollows();
  }
}
