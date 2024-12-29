import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'follow').use).forRoutes(
      {
        path: 'api/follow/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/follow/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
