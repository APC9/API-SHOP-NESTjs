import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  app.setGlobalPrefix('api'); // config prefijo url ej: http://localhost:3000/api/products

  //validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  //swagger documentation
  const config = new DocumentBuilder()
    .setTitle('APC SHOP') // titulo
    .setDescription('APC SHOP RESTFUL API') // descripcion
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
  logger.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
