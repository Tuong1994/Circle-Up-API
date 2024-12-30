import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'friend').use).forRoutes(
      {
        path: 'api/friend/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/friend/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
