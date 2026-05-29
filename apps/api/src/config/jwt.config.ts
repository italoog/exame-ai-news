import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  accessSecret: process.env['JWT_ACCESS_SECRET'] ?? 'default_access_secret_change_in_production',
  refreshSecret: process.env['JWT_REFRESH_SECRET'] ?? 'default_refresh_secret_change_in_production',
  accessExpiresIn: process.env['JWT_ACCESS_EXPIRES_IN'] ?? '15m',
  refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d',
}));
