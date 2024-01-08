import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';

/**
 * Local strategy for passport authentication.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  /**
   * Validates the user's email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns A Promise that resolves to the user if the email and password are valid, otherwise throws an UnauthorizedException.
   */
  async validate(email: string, password: string) {
    try {
      return await this.usersService.verifyUser(email, password);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
