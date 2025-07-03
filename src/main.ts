import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração global de validação
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuração do Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Order Integrator API')
    .setDescription(
      'Sistema de integração de pedidos entre Prime Store e Bahn. ' +
      'Esta API processa pedidos de forma assíncrona, integrando com o sistema Bahn ' +
      'para criação de pedidos e enviando notificações de sucesso para a Prime Store.'
    )
    .setVersion('1.0')
    .addTag('orders', 'Endpoints para criação e gerenciamento de pedidos')
    .setContact(
      'Order Integrator Team',
      '',
      'support@orderintegrator.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
    customSiteTitle: 'Order Integrator API Documentation',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/docs`);
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
