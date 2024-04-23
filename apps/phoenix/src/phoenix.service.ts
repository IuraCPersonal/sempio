import { Injectable } from '@nestjs/common';

@Injectable()
export class PhoenixService {
  getHello(): string {
    return 'Hello World!';
  }
}
