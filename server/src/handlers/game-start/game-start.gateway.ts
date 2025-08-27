import { MessageSenderService } from '@/src/handlers/message-sender/message-sender.service';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class GameStartGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageSenderService: MessageSenderService) {}

  @SubscribeMessage('game:starts')
  handleMessage(@ConnectedSocket() socket) {
    console.log('Game started');
    this.messageSenderService.sendMessageToEveryOneInRoom(
      this.server,
      socket,
      'game:starts',
      {},
    );
    return;
  }
}
