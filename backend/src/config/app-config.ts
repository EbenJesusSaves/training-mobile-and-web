import { existsSync } from 'node:fs';

// Values already present in the environment win over .env (useful for tests and containers).
if (existsSync('.env')) process.loadEnvFile('.env');

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}. Copy .env.example to .env.`);
  }
  return value;
}

export const appConfig = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  smtpHost: process.env.SMTP_HOST ?? 'localhost',
  smtpPort: Number(process.env.SMTP_PORT ?? 1025),
  mailFrom: process.env.MAIL_FROM ?? 'RailPass <no-reply@railpass.dev>',
  logResetCodes: process.env.LOG_RESET_CODES === 'true',
  currency: 'GHS',
  maxPassengersPerBooking: 6,
  seatsPerCompartment: 6,
  passwordResetTtlMinutes: 15,
  passwordResetMaxAttempts: 5,
} as const;
