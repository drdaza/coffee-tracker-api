import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('NestApplication');

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Coffee Tracker API')
    .setDescription('API para gestión de cafés y catas con autenticación JWT')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('auth', 'Endpoints de autenticación')
    .addTag('coffees', 'Gestión de cafés y catas')
    .addTag('users', 'Gestión de usuarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  logger.log(`📖 API Documentation: http://localhost:${envs.PORT}/api/docs`);
  logger.log(`Server is running on port ${envs.PORT}`);
  await app.listen(envs.PORT);
}
bootstrap();
