import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ type: String, description: 'The email of the user' })
  email: string;

  @IsStrongPassword()
  @ApiProperty({ type: String, description: 'The password of the user' })
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({
    type: [String],
    description: 'The roles of the user',
    required: false,
  })
  roles?: string[];
}
