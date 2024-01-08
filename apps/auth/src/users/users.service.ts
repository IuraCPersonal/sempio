import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
/**
 * Service responsible for handling user-related operations.
 */
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Creates a new user with the provided data.
   * @param createUserDto - The data for creating a new user.
   * @returns A promise that resolves to the created user.
   */
  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  /**
   * Validates a user's credentials.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns A promise that resolves to the validated user.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
