import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SavedController } from './saved.controller';
import { SavedService } from './saved.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [SavedController],
  providers: [SavedService],
})
export class SavedModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'saved').use).forRoutes(
      {
        path: 'api/saved/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/saved/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
