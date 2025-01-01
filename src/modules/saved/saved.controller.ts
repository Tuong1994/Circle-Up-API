import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SavedService } from './saved.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { SavedDto } from './saved.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('api/saved')
export class SavedController {
  constructor(private savedService: SavedService) {}

  @Get('list')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getSavedList(@QueryPaging() query: QueryDto) {
    return this.savedService.getSavedList(query);
  }

  @Get('detail')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getSaved(@Query() query: QueryDto) {
    return this.savedService.getSaved(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createSaved(@Body() saved: SavedDto) {
    return this.savedService.createSaved(saved);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateSaved(@Query() query: QueryDto, @Body() saved: SavedDto) {
    return this.savedService.updateSaved(query, saved);
  }

  @Post('remove')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeSavedList(@Query() query: QueryDto) {
    return this.savedService.removeSavedList(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeSavedListPermanent(@Query() query: QueryDto) {
    return this.savedService.removeSavedListPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreSavedList() {
    return this.savedService.restoreSavedList();
  }
}
