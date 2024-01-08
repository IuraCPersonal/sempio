import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
/**
 * JwtStrategy class that extends PassportStrategy.
 * This strategy is responsible for validating JWT tokens and extracting the user information from them.
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication ||
          request?.Authentication ||
          request?.headers?.authorization?.replace('Bearer ', '') ||
          request?.headers?.Authentication,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * Validates the token payload and retrieves the user information from the database.
   * @param {TokenPayload} payload - The token payload containing the user ID.
   * @returns {Promise<User>} - The user object retrieved from the database.
   */
  async validate({ userId }: TokenPayload) {
    return this.usersService.getUser({ _id: userId });
  }
}
