import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const port = process.env.PORT ? Number(process.env.PORT) : 2023;
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(port);
  console.log('App started on', port);
}
bootstrap();
