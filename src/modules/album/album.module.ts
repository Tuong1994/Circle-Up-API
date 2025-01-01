import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { MediaHelper } from '../media/media.helper';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, MediaHelper],
})
export class AlbumModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'album').use).forRoutes(
      {
        path: 'api/album/detail',
        method: RequestMethod.GET,
      },
      {
        path: 'api/album/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
