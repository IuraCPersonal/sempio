import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../decorators';
import { UserDocument } from './models/user.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
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
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user and returns the user details.',
  })
  @ApiBody({
    type: CreateUserDto,
  })
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

  /**
   * Update user.
   * @param updateUserDto - The data for updating a user.
   * @returns The updated user.
   */
  @Post('update')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @CurrentUser() currentUser: UserDocument,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.findOneAndUpdate(currentUser._id, updateUserDto);
  }
}
