import { Response } from 'express';
import { MessagePattern } from '@nestjs/microservices';
import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators';
import { UserDocument } from './users/models/user.schema';
import { RtGuard } from './guards/rt-auth.guard';

@Controller('api/auth')
/**
 * Controller responsible for handling authentication-related requests.
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);

    response.send(user);
  }

  @MessagePattern('authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate() {}

  @Post('refresh')
  @UseGuards(RtGuard, JwtAuthGuard)
  async refreshTokens(
    @CurrentUser() user: UserDocument,
    @Req() request: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshTokens(
      user._id,
      request?.cookies?.Refresh,
      response,
    );
  }
}
