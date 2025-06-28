import { registerAs } from '@nestjs/config';

export interface BahnConfig {
  baseUrl: string;
  username: string;
  password: string;
}

export default registerAs(
  'bahn',
  (): BahnConfig => ({
    baseUrl: process.env.BAHN_BASE_URL || 'https://api.bahn.nordware.io/V1',
    username: process.env.BAHN_USERNAME || 'username',
    password: process.env.BAHN_PASSWORD || 'password',
  }),
);
