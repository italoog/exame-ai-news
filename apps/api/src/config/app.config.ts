import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env['API_PORT'] ?? '3001', 10),
  host: process.env['API_HOST'] ?? '0.0.0.0',
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  corsOrigins: (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000').split(','),
  bcryptSaltRounds: parseInt(process.env['BCRYPT_SALT_ROUNDS'] ?? '12', 10),
}));
