import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { RefreshTokenPayload } from '../interfaces/rt-payload.interface';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Refresh || request?.headers?.Refresh,
      ]),
      secretOrKey: configService.get<string>('RT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: TokenPayload): RefreshTokenPayload {
    const refreshToken = request?.cookies?.Refresh || request?.headers?.Refresh;

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return {
      ...payload,
      refreshToken,
    };
  }
}
