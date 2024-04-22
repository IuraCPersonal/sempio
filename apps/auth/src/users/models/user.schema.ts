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
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
