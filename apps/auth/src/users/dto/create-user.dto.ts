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
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  email: string;

  @IsStrongPassword()
  @ApiProperty({
    example: 'Pa$$w0rd',
    description: "The user's password",
    writeOnly: true,
  })
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({
    example: ['admin', 'user'],
    description: 'The roles of the user',
    required: false,
  })
  roles?: string[];
}
