import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'event').use).forRoutes(
      {
        path: 'api/event/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/event/update',
        method: RequestMethod.POST,
      },
    );
  }
}
