
export interface ApiKeyCredentials {
  apiKey: string;
}

export interface StoreAuthenticationResult {
  apiKey?: string;
}

export interface StoreAuthenticationPort {
  authenticate(
    credentials: ApiKeyCredentials,
  ): Promise<StoreAuthenticationResult>;
  validateToken(apiKey: string): boolean;
}
