import { Controller, Get } from '@nestjs/common';
import { PhoenixService } from './phoenix.service';

@Controller()
export class PhoenixController {
  constructor(private readonly phoenixService: PhoenixService) {}

  @Get('/hello')
  getHello(): string {
    return this.phoenixService.getHello();
  }
}
