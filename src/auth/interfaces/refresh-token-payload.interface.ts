export interface RefreshTokenPayload {
  userId: string;
  deviceId?: string;
  type: 'refresh';
} 