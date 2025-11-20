import * as crypto from 'crypto'; //incluída linha para corrigir erro de "crypto" no NestJS
global.crypto = crypto as any; //incluída linha para corrigir erro de "crypto" no NestJS
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  dotenv.config();
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (!globalThis.crypto) {
    globalThis.crypto = {
      randomUUID,
    } as Crypto;
  }

  const config = new DocumentBuilder()
    .setTitle('API PI 5 SEMESTRE')
    .setDescription('Documentação da API utilizada no PI 5º Semestre para um sistema de vault de senhas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // rota do Swagger: /api-docs


  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // Lança erro se propriedades extras forem enviadas
    transform: true, // Transforma os dados de entrada para os tipos do DTO
  }));
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
