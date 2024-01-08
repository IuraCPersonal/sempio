import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
/**
 * Service responsible for handling authentication-related operations.
 */
export class AuthService {
  constructor(
    private readonly configSerice: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Logs in a user and sets the authentication token in the response cookie.
   * @param user - The user document.
   * @param response - The response object.
   */
  async login(user: UserDocument, response: Response) {
    const tokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();

    expires.setSeconds(
      expires.getSeconds() + this.configSerice.get<number>('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    // Set the authentication token in the response cookie.
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }
}
