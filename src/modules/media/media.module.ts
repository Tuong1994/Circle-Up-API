import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaHelper } from './media.helper';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [MediaController],
  providers: [MediaService, MediaHelper],
})
export class MediaModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'media').use).forRoutes(
      {
        path: 'api/media/userUpload',
        method: RequestMethod.POST,
      },
      {
        path: 'api/media/postUpload',
        method: RequestMethod.POST,
      },
    );
  }
}
