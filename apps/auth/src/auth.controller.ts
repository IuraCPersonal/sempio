import { Response } from 'express';
import { MessagePattern } from '@nestjs/microservices';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators';
import { UserDocument } from './users/models/user.schema';
import { RtGuard } from './guards/rt-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
/**
 * Controller responsible for handling authentication-related requests.
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Log in a user',
    description: 'Logs in a user and returns the user details.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'example@mail.com',
        },
        password: {
          type: 'string',
          example: '112233Api!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: UserDocument,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
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
