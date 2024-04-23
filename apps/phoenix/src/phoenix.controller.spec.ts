import { Test, TestingModule } from '@nestjs/testing';
import { PhoenixController } from './phoenix.controller';
import { PhoenixService } from './phoenix.service';

describe('PhoenixController', () => {
  let phoenixController: PhoenixController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PhoenixController],
      providers: [PhoenixService],
    }).compile();

    phoenixController = app.get<PhoenixController>(PhoenixController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(phoenixController.getHello()).toBe('Hello World!');
    });
  });
});
