export interface AuthResponse {
    id: string;
    name: string;
    email: string;
    token: string;
    refreshToken: string;
    expiresIn: number;
  }