import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Cookie parser (for refresh tokens)
  app.use(cookieParser());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS
  const frontendUrl = config.get<string>('FRONTEND_URL', 'http://localhost:3000');
  app.enableCors({
    origin: [
      frontendUrl,
      'https://interngo.uz',
      'https://www.interngo.uz',
      /\.vercel\.app$/,
      'http://localhost:3000',
    ],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('InternGo API')
    .setDescription('Backend API for InternGo — internship & scholarship platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<number>('PORT', 8080);
  await app.listen(port, '0.0.0.0');
  console.log(`InternGo API running on port ${port}`);
}
bootstrap();
