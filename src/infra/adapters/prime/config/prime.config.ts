import { registerAs } from '@nestjs/config';

export interface PrimeConfig {
  baseUrl: string;
  apiKey: string;
}

export default registerAs(
  'prime',
  (): PrimeConfig => ({
    baseUrl: process.env.PRIME_API_URL ?? '',
    apiKey: process.env.PRIME_API_KEY ?? '',
  }),
);
