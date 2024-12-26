import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostHelper } from './post.helper';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [PostController],
  providers: [PostService, PostHelper],
})
export class PostModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'post').use).forRoutes(
      {
        path: 'api/post/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/post/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
