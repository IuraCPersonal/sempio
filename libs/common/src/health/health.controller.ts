import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthController {
  @Get()
  getHealth(): boolean {
    return true;
  }
}
