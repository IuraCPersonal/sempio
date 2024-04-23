import { NestFactory } from '@nestjs/core';
import { PhoenixModule } from './phoenix.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PhoenixModule);
  const configService = app.get(ConfigService);

  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
