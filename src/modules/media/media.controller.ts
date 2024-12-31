import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { multerOption } from 'src/common/config/multer.config';

@Controller('api/media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('userUpload')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('medias', 5, multerOption()))
  userUpload(@Query() query: QueryDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.mediaService.userUpload(query, files);
  }

  @Post('postUpload')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('medias', 5, multerOption()))
  postUpload(@Query() query: QueryDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.mediaService.postUpload(query, files);
  }
}
