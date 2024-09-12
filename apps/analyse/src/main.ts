import { NestFactory } from '@nestjs/core';
import { AnalyseModule } from './analyse.module';

async function bootstrap() {
  const app = await NestFactory.create(AnalyseModule);
  app.enableCors();
  await app.listen(3004);
}
bootstrap();
