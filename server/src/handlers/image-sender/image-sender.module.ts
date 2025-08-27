import { Module } from '@nestjs/common';
import { ImageSenderGateway } from './image-sender.gateway';
import { ImageSenderService } from './image-sender.service';
import { MessageSenderModule } from '@/src/handlers/message-sender/message-sender.module';

@Module({
  providers: [ImageSenderGateway, ImageSenderService],
  imports: [MessageSenderModule],
})
export class ImageSenderModule {}
