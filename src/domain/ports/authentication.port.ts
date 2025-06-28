export interface UsernamePasswordCredentials {
  username: string;
  password: string;
}

export interface ApiKeyCredentials {
  apiKey: string;
}

export interface AuthenticationResult {
  accessToken?: string;
  apiKey?: string;
}

export type AuthenticationCredentials =
  | UsernamePasswordCredentials
  | ApiKeyCredentials;

export interface AuthenticationPort {
  authenticate(
    credentials: AuthenticationCredentials,
  ): Promise<AuthenticationResult>;
  validateToken(token: string): boolean;
}
