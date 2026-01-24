import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from 'src/shared/services/config-service/config.service';
import { NodeEnvironment } from 'src/shared/services/config-service/env-variables/env-schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<AppConfigService>(AppConfigService);

  const nodeEnv = config.get('NODE_ENV');
  const allowedOrigins = config.get('CORS_ORIGIN');

  app.enableCors({
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  app.setGlobalPrefix('api/');

  if (nodeEnv !== NodeEnvironment.Production) {
    const config = new DocumentBuilder().setTitle('Alpine API').setVersion('1.0').addBearerAuth().build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  app.use(cookieParser(config.get('COOKIE_SECRET')));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(config.get('PORT'));
}

void bootstrap();
