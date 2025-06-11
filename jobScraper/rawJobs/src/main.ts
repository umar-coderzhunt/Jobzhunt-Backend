import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from './shared/enums/server.enum';
import { IServerConfig } from './shared/interfaces/server.interface';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get<ConfigService>(ConfigService);

  const { port: SERVER_PORT, prefix: ENDPOINT_PREFIX } =
    configService.get<IServerConfig>(ConfigEnum.SERVER);
  app.setGlobalPrefix(ENDPOINT_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors();

  // Swagger configuration
  const swaggerConfig = configService.get(ConfigEnum.SWAGGER);
  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerConfig.documentBuilder,
  );
  SwaggerModule.setup(swaggerConfig.path, app, swaggerDocument);

  await app.listen(SERVER_PORT);
  logger.log(`Server is running on: ${await app.getUrl()}`);
  logger.log(
    `Swagger documentation is available at: ${await app.getUrl()}/${swaggerConfig.path}`,
  );
}
bootstrap();
