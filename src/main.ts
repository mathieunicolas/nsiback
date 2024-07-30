import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  /*app.enableCors({
    origin: 'http://localhost:3000', // Remplacer par l'URL de votre frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si vous utilisez des cookies
  });*/

  const config = new DocumentBuilder()
    .setTitle('NSI Rocks !')
    .setDescription("Description de l'API de nsi.rocks")
    .setVersion('0.1')
    .addCookieAuth('jwt')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
