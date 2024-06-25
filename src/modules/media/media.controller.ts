import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { QueryDto } from 'src/common/dto/query.dto';
import { multerOption } from 'src/common/config/multer.config';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';
import { RoleGuard } from 'src/common/guard/role.guard';
import { QueryPaging } from 'src/common/decorator/query.decorator';

@Controller('api/media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getImages(@QueryPaging() query: QueryDto) {
    return this.mediaService.getMedias(query);
  }

  @Post('user')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image', multerOption()))
  @HttpCode(HttpStatus.OK)
  userUpload(@Query() query: QueryDto, @UploadedFile() file: Express.Multer.File) {
    return this.mediaService.userUpload(query, file);
  }

  @Post('post')
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('media', 5, multerOption()))
  @HttpCode(HttpStatus.OK)
  postUpload(@Query() query: QueryDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.mediaService.postUpload(query, files);
  }

  @Delete('remove')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeMedias(@Query() query: QueryDto) {
    return this.mediaService.removeMedias(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeMediasPermanent(@Query() query: QueryDto) {
    return this.mediaService.removeMediasPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreMedias() {
    return this.mediaService.restoreMedias();
  }
}
