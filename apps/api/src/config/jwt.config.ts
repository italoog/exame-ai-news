import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => {
  const accessSecret = process.env['JWT_ACCESS_SECRET'] ?? process.env['JWT_SECRET']
  const refreshSecret = process.env['JWT_REFRESH_SECRET']

  if (!accessSecret || !refreshSecret) {
    throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be defined')
  }

  return {
    accessSecret,
    refreshSecret,
    accessExpiresIn: process.env['JWT_ACCESS_EXPIRES_IN'] ?? process.env['JWT_EXPIRES_IN'] ?? '1h',
    refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d',
  }
});
