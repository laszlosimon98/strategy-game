import { Test, TestingModule } from '@nestjs/testing';
import { HandleConnectionGateway } from './handle-connection.gateway';
import { HandleConnectionService } from './handle-connection.service';

describe('HandleConnectionGateway', () => {
  let gateway: HandleConnectionGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandleConnectionGateway, HandleConnectionService],
    }).compile();

    gateway = module.get<HandleConnectionGateway>(HandleConnectionGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
