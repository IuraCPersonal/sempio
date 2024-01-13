import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { Types } from 'mongoose';
import { UserDocument } from './models/user.schema';

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
    await this.validateCreateUserDto(createUserDto);

    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  /**
   * Validates a CreateUserDto.
   * @param createUserDto - The data for creating a new user.
   * @throws UnprocessableEntityException if the email is already taken.
   */
  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      return;
    }

    throw new UnprocessableEntityException('Email already exists');
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

  /**
   * Gets a user.
   * @param getUserDto - The data for getting a user.
   * @returns A promise that resolves to the user.
   */
  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  /**
   * Finds a user by ID and updates their information.
   * @param userId - The ID of the user.
   * @param update - The partial data to update.
   * @returns A promise that resolves to the updated user.
   */
  async findOneAndUpdate(
    userId: Types.ObjectId,
    update: Partial<UserDocument>,
  ): Promise<UserDocument | null> {
    return this.usersRepository.findOneAndUpdate({ _id: userId }, update);
  }
}
