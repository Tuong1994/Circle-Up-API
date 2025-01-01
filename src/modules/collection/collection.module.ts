import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'collection').use).forRoutes(
      {
        path: 'api/collection/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/collection/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
