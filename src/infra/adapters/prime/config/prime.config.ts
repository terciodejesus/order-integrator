import { registerAs } from '@nestjs/config';

export interface PrimeConfig {
  apiUrl: string;
  apiKey: string;
}

export default registerAs(
  'prime',
  (): PrimeConfig => ({
    apiUrl: process.env.PRIME_API_URL ?? '',
    apiKey: process.env.PRIME_API_KEY ?? '',
  }),
);
