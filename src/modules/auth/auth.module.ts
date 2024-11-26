import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStategy } from 'src/common/strategy/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { CheckIdMiddleware } from 'src/common/middleware/checkId.middleware';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, JwtService, JwtStategy],
})
export class AuthModule implements NestModule {
  constructor(private prisma: PrismaService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new CheckIdMiddleware(this.prisma, 'user').use).forRoutes(
      {
        path: 'api/auth/refresh',
        method: RequestMethod.POST,
      },
      {
        path: 'api/auth/logout',
        method: RequestMethod.POST,
      },
    );
  }
}
