import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ExcelModule } from './excel/excel.module';
import { CommentModule } from './comment/comment.module';
import { EmailModule } from './email/email.module';
import { CityModule } from './city/city.module';
import { DistrictModule } from './district/district.module';
import { WardModule } from './ward/ward.module';
import { LikeModule } from './like/like.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CloudinaryModule,
    ExcelModule,
    EmailModule,
    AuthModule,
    UserModule,
    CommentModule,
    LikeModule,
    CityModule,
    DistrictModule,
    WardModule,
  ],
})
export class AppModule {}
