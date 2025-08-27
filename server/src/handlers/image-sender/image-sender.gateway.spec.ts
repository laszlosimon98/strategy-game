import { Test, TestingModule } from '@nestjs/testing';
import { ImageSenderGateway } from './image-sender.gateway';

describe('ImageSenderGateway', () => {
  let gateway: ImageSenderGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageSenderGateway],
    }).compile();

    gateway = module.get<ImageSenderGateway>(ImageSenderGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
