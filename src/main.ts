import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './guards/authGuard';
import { RolesGuard } from './guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalGuards(app.get(JwtAuthGuard), app.get(RolesGuard));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
