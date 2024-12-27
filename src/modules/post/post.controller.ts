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
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  getPosts(@QueryPaging() query: QueryDto) {
    return this.postService.getPosts(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  getPost(@Query() query: QueryDto) {
    return this.postService.getPost(query);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('medias', 5, multerOption()))
  createPost(@Query() query: QueryDto, @UploadedFiles() files: Express.Multer.File[], @Body() post: PostDto) {
    return this.postService.creatPost(query, files, post);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('medias', 5, multerOption()))
  updatePost(@Query() query: QueryDto, @UploadedFiles() files: Express.Multer.File[], @Body() post: PostDto) {
    return this.postService.updatePost(query, files, post);
  }

  @Post('remove')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard, RoleGuard)
  @Roles(ERole.STAFF, ERole.LEADER, ERole.MANAGER)
  removePosts(@Query() query: QueryDto) {
    return this.postService.removePosts(query);
  }

  @Delete('removePermanent')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard, RoleGuard)
  @Roles(ERole.LEADER, ERole.MANAGER)
  removePostsPermanent(@Query() query: QueryDto) {
    return this.postService.removePostsPermanent(query);
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard, RoleGuard)
  @Roles(ERole.LEADER, ERole.MANAGER)
  restorePosts() {
    return this.postService.restorePosts();
  }
}
