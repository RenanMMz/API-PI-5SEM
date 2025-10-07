import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API PI 5 SEMESTRE')
    .setDescription('Documentação da API utilizada no PI 5º Semestre para um sistema de Coletora')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // rota do Swagger: /api-docs

  if (!globalThis.crypto) {
    globalThis.crypto = {
      randomUUID,
    } as Crypto;
  }

  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Credentials',
    ],
  });

  await app.listen(3333);
}
bootstrap();
