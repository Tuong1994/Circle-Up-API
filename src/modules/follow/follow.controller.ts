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
import { FollowService } from './follow.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { FollowDto } from './follow.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('api/follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getFollows(@QueryPaging() query: QueryDto) {
    return this.followService.getFollows(query);
  }

  @Get('detail')
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

  @Delete('remove')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeFollows(@Query() query: QueryDto) {
    return this.followService.removeFollows(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeFollowsPermanent(@Query() query: QueryDto) {
    return this.followService.removeFollowsPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreFollows() {
    return this.followService.restoreFollows();
  }
}
