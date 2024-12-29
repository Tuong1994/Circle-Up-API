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
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  getFollows(@QueryPaging() query: QueryDto) {
    return this.followService.getFollows(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  getFollow(@Query() query: QueryDto) {
    return this.followService.getFollow(query);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  createFollow(@Body() follow: FollowDto) {
    return this.followService.createFollow(follow);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  updateFollow(@Query() query: QueryDto, @Body() follow: FollowDto) {
    return this.followService.updateFollow(query, follow);
  }

  @Post('remove')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  removeFollows(@Query() query: QueryDto) {
    return this.followService.removeFollows(query);
  }

  @Post('removePermanent')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  removeFollowsPermanent(@Query() query: QueryDto) {
    return this.followService.removeFollowsPermanent(query);
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  restoreFollows() {
    return this.followService.restoreFollows();
  }
}
