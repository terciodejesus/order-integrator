import { registerAs } from "@nestjs/config";

export interface BahnConfig {
  baseUrl: string;
}

export default registerAs('bahn', (): BahnConfig => ({
  baseUrl: process.env.BAHN_BASE_URL || 'entrou aqui',
}))