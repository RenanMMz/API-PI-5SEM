import { Test, TestingModule } from '@nestjs/testing';
import { TgfdocaService } from './tgfdoca.service';

describe('TgfdocaService', () => {
  let service: TgfdocaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TgfdocaService],
    }).compile();

    service = module.get<TgfdocaService>(TgfdocaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
