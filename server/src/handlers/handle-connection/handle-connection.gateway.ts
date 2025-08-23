import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { HandleConnectionService } from './handle-connection.service';
import { MessageSenderService } from '@/src/handlers/message-sender/message-sender.service';
import { Server, Socket } from 'socket.io';
import { PlayerService } from '@/src/handlers/player/player.service';
import { CreateConnectionDto } from '@/src/handlers/handle-connection/dto/create-connection.dto';
import { JoinConnectionDto } from '@/src/handlers/handle-connection/dto/join-connection.dto';
import { MAX_PLAYER } from '@/src/settings';

@WebSocketGateway()
export class HandleConnectionGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly handleConnectionService: HandleConnectionService,
    private readonly messageSenderService: MessageSenderService,
    private readonly playerService: PlayerService,
  ) {}

  @SubscribeMessage('connect:create')
  create(
    @MessageBody() createConnectionDto: CreateConnectionDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { name } = createConnectionDto;

    const code = this.handleConnectionService.create(
      createConnectionDto,
      socket,
    );

    this.messageSenderService.sendMessageToSender(socket, 'connect:code', {
      code,
    });

    this.playerService.newPlayerMessage(this.server, socket, code, name);
  }

  @SubscribeMessage('connect:join')
  join(
    @MessageBody() joinConnectionDto: JoinConnectionDto,
    @ConnectedSocket() socket,
  ) {
    const { name, code } = joinConnectionDto;

    if (!this.handleConnectionService.isRoomExists(this.server, code)) {
      this.messageSenderService.sendMessageToSender(
        socket,
        'connect:error',
        'Rossz csatlakozási kód!',
      );
      return;
    }

    if (
      this.handleConnectionService.getRoomSize(this.server, code) >= MAX_PLAYER
    ) {
      this.messageSenderService.sendMessageToSender(
        socket,
        'connect:error',
        'A váró megtelt!',
      );
      return;
    }

    if (this.handleConnectionService.isGameStarted(code)) {
      this.messageSenderService.sendMessageToSender(
        socket,
        'connect:error',
        'Sikertelen csatlakozás. A játék elkezdődött!',
      );
      return;
    }

    this.handleConnectionService.join(socket, joinConnectionDto);

    this.messageSenderService.sendMessageToSender(socket, 'connect:error', '');
    this.messageSenderService.sendMessageToSender(socket, 'connect:code', {
      code,
    });

    this.playerService.newPlayerMessage(this.server, socket, code, name);
  }

  @SubscribeMessage('connect:disconnect')
  disconnect(@ConnectedSocket() socket: Socket) {
    const userName = this.handleConnectionService.disconnect(socket);

    this.playerService.playerLeftMessage(this.server, socket, userName);
  }

  @SubscribeMessage('disconnecting')
  disconnecting(@ConnectedSocket() socket: Socket) {
    const userName = this.handleConnectionService.disconnect(socket);

    this.playerService.playerLeftMessage(this.server, socket, userName);
  }
}
