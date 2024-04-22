// src/common-swagger/common-swagger.module.ts
import { Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({})
export class CommonSwaggerModule {
  static createDocument(app) {
    const config = new DocumentBuilder()
      .setTitle('Home Swift API')
      .setDescription('This page includes all the APIs for Home Swift App.')
      .setVersion('1.0')
      .addTag('HomeServices')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    return document;
  }
}
