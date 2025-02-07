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
import { PostService } from './post.service';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostDto } from './post.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { multerOption } from 'src/common/config/multer.config';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';

@Controller('api/post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('list')
  // @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getPosts(@QueryPaging() query: QueryDto) {
    return this.postService.getPosts(query);
  }

  @Get('detail')
  // @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getPost(@Query() query: QueryDto) {
    return this.postService.getPost(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('medias', 5, multerOption()))
  @HttpCode(HttpStatus.CREATED)
  createPost(@Query() query: QueryDto, @UploadedFiles() files: Express.Multer.File[], @Body() post: PostDto) {
    return this.postService.creatPost(query, files, post);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('medias', 5, multerOption()))
  @HttpCode(HttpStatus.OK)
  updatePost(@Query() query: QueryDto, @UploadedFiles() files: Express.Multer.File[], @Body() post: PostDto) {
    return this.postService.updatePost(query, files, post);
  }

  @Delete('remove')
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removePosts(@Query() query: QueryDto) {
    return this.postService.removePosts(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removePostsPermanent(@Query() query: QueryDto) {
    return this.postService.removePostsPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restorePosts() {
    return this.postService.restorePosts();
  }
}
