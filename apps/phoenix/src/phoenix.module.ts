import { Module } from '@nestjs/common';
import { PhoenixController } from './phoenix.controller';
import { PhoenixService } from './phoenix.service';
import { HealthModule, LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
      }),
    }),
    HealthModule,
  ],
  controllers: [PhoenixController],
  providers: [PhoenixService],
})
export class PhoenixModule {}
