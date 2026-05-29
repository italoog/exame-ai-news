import { NestFactory } from '@nestjs/core'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import compression from 'compression'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT', 3001)

  // Security
  app.use(helmet())
  app.use(compression())

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  // Global prefix
  app.setGlobalPrefix('api')

  // Versioning
  app.enableVersioning({ type: VersioningType.URI })

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('EXAME AI NEWS API')
    .setDescription('API da plataforma de notícias EXAME AI NEWS')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)

  // Swagger apenas em desenvolvimento
  if (configService.get('NODE_ENV') !== 'production') {
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    })
  }

  await app.listen(port)
  console.log(`🚀 API rodando em http://localhost:${port}/api`)
  console.log(`📚 Swagger em http://localhost:${port}/api/docs`)
}

bootstrap()
