import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop()
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @Prop()
  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
    writeOnly: true,
  })
  password: string;

  @Prop()
  @ApiProperty({
    description: 'Hashed refresh token',
    example: 'hashedTokenHere',
    required: false,
  })
  hashedRt?: string;

  @Prop()
  @ApiProperty({
    description: 'User roles',
    example: ['admin', 'user'],
    required: false,
  })
  roles?: string[];

  @Prop()
  @ApiProperty({
    description: 'First Name',
    example: 'John',
    required: true,
  })
  firstName?: string;

  @Prop()
  @ApiProperty({
    description: 'Last Name',
    example: 'Doe',
    required: true,
  })
  lastName?: string;

  @Prop()
  @ApiProperty({
    description: 'Birth Date',
    example: '1990-01-01',
    required: true,
  })
  birthDate?: string;

  @Prop({
    match: /^\+373\d{8}$/,
    description: 'Phone number must start with +373 followed by 8 digits',
  })
  @ApiProperty({
    description: 'Phone Number',
    example: '+37369090902',
    required: true,
  })
  phoneNumber?: string;

  @Prop()
  @ApiProperty({
    description: 'Country',
    example: 'Moldova',
    required: true,
  })
  country?: string;

  @Prop()
  @ApiProperty({
    description: 'Region',
    example: 'Chisinau',
    required: true,
  })
  region?: string;

  @Prop()
  @ApiProperty({
    description: 'City',
    example: 'Chisinau',
    required: true,
  })
  city?: string;

  @Prop({
    match: /^MD-\d{4}$/,
    description: 'Must follow the format MD-XXXX',
  })
  @ApiProperty({
    description: 'Postal Code',
    example: 'MD-2001',
    required: true,
  })
  postalCode?: string;

  @Prop()
  @ApiProperty({
    description: 'Appartment Number',
    example: '12',
    required: false,
  })
  appartmentNumber?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
