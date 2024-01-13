import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../decorators';
import { UserDocument } from './models/user.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('api/users')
/**
 * Controller for managing users.
 */
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user.
   * @param createUserDto - The data for creating a new user.
   * @returns The created user.
   */
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Get the current user.
   * @returns The current user.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() currentUser: UserDocument) {
    return currentUser;
  }
}
