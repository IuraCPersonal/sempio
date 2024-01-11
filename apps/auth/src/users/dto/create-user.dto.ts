import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ type: String, description: 'The email of the user' })
  email: string;

  @IsStrongPassword()
  @ApiProperty({ type: String, description: 'The password of the user' })
  password: string;
}
