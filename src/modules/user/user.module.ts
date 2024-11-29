import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    const applyMiddlewareFor = (type: string, route: string, method: RequestMethod) => {
      consumer.apply(new CheckIdMiddleware(this.prisma, type).use).forRoutes({
        path: route,
        method,
      });
    };

    applyMiddlewareFor('user', 'api/user/detail', RequestMethod.GET);
    applyMiddlewareFor('user', 'api/user/update', RequestMethod.PUT);
    applyMiddlewareFor('userInfo', 'api/user/updateInfo', RequestMethod.PUT);
    applyMiddlewareFor('userWork', 'api/user/updateWork', RequestMethod.PUT);
    applyMiddlewareFor('userEducation', 'api/user/updateEducation', RequestMethod.PUT);
    applyMiddlewareFor('userLived', 'api/user/updateLived', RequestMethod.PUT);
  }
}
