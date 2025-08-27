import { Test, TestingModule } from '@nestjs/testing';
import { ImageSenderService } from './image-sender.service';

describe('ImageSenderService', () => {
  let service: ImageSenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageSenderService],
    }).compile();

    service = module.get<ImageSenderService>(ImageSenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
