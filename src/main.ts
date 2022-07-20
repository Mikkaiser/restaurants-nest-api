import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('NestJS API - by Mikkaiser')
    .setDescription(
      'An REST API built with TypeScript and MongoDB, using the NestJS framework. This API is used to manage restaurants and meals, according to user authentication! It also includes unit and e2e tests.',
    )
    .setVersion('1.0')
    .addTag('restaurants')
    .addTag('auth')
    .addTag('meals')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  console.log(process.env.DB_URI);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
