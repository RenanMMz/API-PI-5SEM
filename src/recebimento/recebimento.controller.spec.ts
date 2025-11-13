import { Test, TestingModule } from '@nestjs/testing';
import { RecebimentoController } from './recebimento.controller';

describe('RecebimentoController', () => {
  let controller: RecebimentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecebimentoController],
    }).compile();

    controller = module.get<RecebimentoController>(RecebimentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
