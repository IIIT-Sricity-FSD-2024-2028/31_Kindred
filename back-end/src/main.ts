import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── CORS ────────────────────────────────────────────────────
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization,role',
  });

  // ── Global Validation Pipe ──────────────────────────────────
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

  // ── Global Response Interceptor ─────────────────────────────
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ── Global Exception Filter ─────────────────────────────────
  app.useGlobalFilters(new AllExceptionsFilter());

  // ── Swagger Configuration ───────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Kindred Platform API')
    .setDescription(
      'Backend REST API for Kindred — India\'s Volunteer Platform. ' +
      'Supports Users, Organizations, Volunteers, Programs, Requests, ' +
      'Tasks, Hour Logs, Resource Donations, Program Assignments, ' +
      'Program Applications, and Subtasks. ' +
      'Role-based access control via the "role" header.',
    )
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ── Export swagger.json ────────────────────────────────────
  const docsDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(docsDir, 'swagger.json'),
    JSON.stringify(document, null, 2),
  );
  console.log('📄 swagger.json exported to docs/swagger.json');

  // ── Start Server ────────────────────────────────────────────
  await app.listen(3000);
  console.log('🚀 Kindred API running on http://localhost:3000');
  console.log('📚 Swagger UI available at http://localhost:3000/api/docs');
}

bootstrap();
