import { Test, TestingModule } from '@nestjs/testing';
import { StartonService } from './starton.service';

describe('StartonService', () => {
  let service: StartonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StartonService],
    }).compile();

    service = module.get<StartonService>(StartonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
