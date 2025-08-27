import { Test, TestingModule } from '@nestjs/testing';
import { GameStartGateway } from './game-start.gateway';

describe('GameStartGateway', () => {
  let gateway: GameStartGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameStartGateway],
    }).compile();

    gateway = module.get<GameStartGateway>(GameStartGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
