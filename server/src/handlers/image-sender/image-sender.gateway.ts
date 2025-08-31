import { ImageSenderService } from '@/src/handlers/image-sender/image-sender.service';
import { MessageSenderService } from '@/src/handlers/message-sender/message-sender.service';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import * as path from 'path';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ImageSenderGateway {
  constructor(
    private readonly messageSenderService: MessageSenderService,
    private readonly imageSenderService: ImageSenderService,
  ) {}

  @SubscribeMessage('game:images')
  public async handleImages(@ConnectedSocket() socket: Socket) {
    try {
      const images = await this.imageSenderService.loadImages(
        path.join(__dirname, '..', '..', '..', 'public', 'assets'),
      );

      console.log(images);

      this.messageSenderService.sendMessageToSender(
        socket,
        'game:images',
        images,
      );
    } catch (error) {
      this.messageSenderService.sendMessageToSender(
        socket,
        'game:imagesError',
        {
          error: 'Hiba történt a képek betöltése során',
        },
      );
    }
  }
}
