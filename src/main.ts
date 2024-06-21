import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common/pipes';
import { CorsOptions } from 'cors';
import cors = require('cors');
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const corsOptions: CorsOptions = {
    origin: ['*'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  };
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(cors(corsOptions));
  await app.listen(6000);
}
bootstrap();
