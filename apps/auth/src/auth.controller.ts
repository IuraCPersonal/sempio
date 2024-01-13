import { Response } from 'express';
import { MessagePattern } from '@nestjs/microservices';
import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDocument } from './users/models/user.schema';
import { RtGuard } from './guards/rt-auth.guard';

@Controller('api/auth')
@ApiTags('auth')
/**
 * Controller responsible for handling authentication-related requests.
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: UserDocument })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
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
  @ApiOperation({ summary: 'Refresh the access and refresh tokens.' })
  @ApiBody({ type: UserDocument })
  @ApiResponse({
    status: 201,
    description: 'Tokens refreshed successfully.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
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
