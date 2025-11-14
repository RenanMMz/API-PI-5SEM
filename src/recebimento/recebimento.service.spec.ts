import { Test, TestingModule } from '@nestjs/testing';
import { RecebimentoService } from './recebimento.service';

describe('RecebimentoService', () => {
  let service: RecebimentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecebimentoService],
    }).compile();

    service = module.get<RecebimentoService>(RecebimentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
