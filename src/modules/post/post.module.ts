import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostHelper } from './post.helper';

@Module({
  controllers: [PostController],
  providers: [PostService, PostHelper],
})
export class PostModdle {}
