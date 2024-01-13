import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop()
  @ApiProperty({
    example: 'test.user@gmail.com',
    description: 'The email of the user',
  })
  email: string;

  @Prop()
  @ApiProperty({
    example: '112233Api!',
    description: 'The password of the user',
  })
  password: string;

  @Prop()
  hashedRt?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
