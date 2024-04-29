import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users/users.service';
import { Types } from 'mongoose';
import { Tokens } from './types/tokens.type';

@Injectable()
/**
 * Service responsible for handling authentication-related operations.
 */
export class AuthService {
  constructor(
    private readonly configSerice: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Logs in a user and sets the authentication token in the response cookie.
   * @param user - The user document.
   * @param response - The response object.
   */
  async login(user: UserDocument, response: Response) {
    const tokens = await this.getTokens(user._id, user.email);

    await this.updateRtHash(user._id, tokens.refresh_token);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configSerice.get<number>('JWT_EXPIRATION'),
    );

    // Set the authentication token in the response cookie.
    response.cookie('Authentication', tokens.access_token, {
      httpOnly: true,
      expires,
      sameSite: 'none',
    });

    // response.cookie('Refresh', tokens.refresh_token, {
    //   httpOnly: true,
    // });

    return tokens;
  }

  private async updateRtHash(userId: Types.ObjectId, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);

    await this.usersService.findOneAndUpdate(userId, { hashedRt: hash });
  }

  async refreshTokens(
    userId: Types.ObjectId,
    refreshToken: string,
    response: Response,
  ) {
    const user = await this.usersService.getUser({
      _id: userId.toHexString(),
    });

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await bcrypt.compare(refreshToken, user.hashedRt);

    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configSerice.get<number>('JWT_EXPIRATION'),
    );

    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRtHash(user._id, tokens.refresh_token);

    // Set the authentication token in the response cookie.
    response.cookie('Authentication', tokens.access_token, {
      httpOnly: true,
      expires,
    });

    response.cookie('Refresh', tokens.refresh_token, {
      httpOnly: true,
    });

    return tokens;
  }

  async getTokens(userId: Types.ObjectId, email: string): Promise<Tokens> {
    const tokenPayload: TokenPayload = {
      userId: userId.toHexString(),
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(tokenPayload, {
        secret: this.configSerice.get<string>('JWT_SECRET'),
        expiresIn: this.configSerice.get<string>('JWT_EXPIRATION'),
      }),
      this.jwtService.signAsync(tokenPayload, {
        secret: this.configSerice.get<string>('RT_SECRET'),
        expiresIn: this.configSerice.get<string>('RT_EXPIRATION'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
