import { Test, TestingModule } from '@nestjs/testing';
import { HandleConnectionService } from './handle-connection.service';

describe('HandleConnectionService', () => {
  let service: HandleConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandleConnectionService],
    }).compile();

    service = module.get<HandleConnectionService>(HandleConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
