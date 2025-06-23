export interface UsernamePasswordCredentials {
  username: string;
  password: string;
}

export interface AuthenticationResult {
  accessToken: string;
}

export interface AuthenticationPort {
  authenticate(credentials: UsernamePasswordCredentials): Promise<AuthenticationResult>;
  validateToken(token: string): boolean;
}