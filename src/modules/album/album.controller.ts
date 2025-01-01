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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { AlbumDto } from './album.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { RoleGuard } from 'src/common/guard/role.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/config/multer.config';

@Controller('api/album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get('list')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getAlbums(@QueryPaging() query: QueryDto) {
    return this.albumService.getAlbums(query);
  }

  @Get('detail')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getAlbum(@Query() query: QueryDto) {
    return this.albumService.getAlbum(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('medias', 5, multerOption()))
  @HttpCode(HttpStatus.CREATED)
  createAlbum(
    @Query() query: QueryDto,
    @Body() album: AlbumDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.albumService.createAlbum(query, album, files);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('medias', 5, multerOption()))
  @HttpCode(HttpStatus.OK)
  updateAlbum(
    @Query() query: QueryDto,
    @Body() album: AlbumDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.albumService.updateAlbum(query, album, files);
  }

  @Delete('remove')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeAlbums(@Query() query: QueryDto) {
    return this.albumService.removeAlbums(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removePermanent(@Query() query: QueryDto) {
    return this.albumService.removeAlbumsPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreAlbums() {
    return this.albumService.restoreAlbums();
  }
}
