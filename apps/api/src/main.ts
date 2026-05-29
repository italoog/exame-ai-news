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
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  })

  await app.listen(port)
  console.log(`🚀 API rodando em http://localhost:${port}/api`)
  console.log(`📚 Swagger em http://localhost:${port}/api/docs`)
}

bootstrap()


async function bootstrap() {
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, context }) => {
            return `${timestamp} [${context ?? 'App'}] ${level}: ${message}`;
          }),
        ),
      }),
    ],
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_PORT') ?? 3001;
  const corsOrigins = configService.get<string>('CORS_ORIGINS') ?? 'http://localhost:3000';

  // Security
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: corsOrigins.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Versioning
  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger
  if (configService.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('EXAME AI NEWS API')
      .setDescription('API da plataforma EXAME AI NEWS')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT-auth',
      )
      .addTag('auth', 'Autenticação')
      .addTag('users', 'Usuários')
      .addTag('articles', 'Artigos')
      .addTag('categories', 'Categorias')
      .addTag('tags', 'Tags')
      .addTag('comments', 'Comentários')
      .addTag('favorites', 'Favoritos')
      .addTag('analytics', 'Analytics')
      .addTag('health', 'Health Check')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(port);
  logger.log(`🚀 API rodando em http://localhost:${port}/api`, 'Bootstrap');
  logger.log(`📖 Swagger em http://localhost:${port}/docs`, 'Bootstrap');
}

bootstrap();
