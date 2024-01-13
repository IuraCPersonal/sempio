import { TokenPayload } from './token-payload.interface';

export interface RefreshTokenPayload extends TokenPayload {
  refreshToken: string;
}
