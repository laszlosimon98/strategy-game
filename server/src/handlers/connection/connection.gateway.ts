import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConnectionService } from './connection.service';
import { CreateConnectionDto } from '@/src/handlers/connection/dto/create-connection.dto';
import { JoinConnectionDto } from '@/src/handlers/connection/dto/join-connection.dto';
import { MAX_PLAYER } from '@/src/settings';
import { MessageSenderService } from '@/src/handlers/message-sender/message-sender.service';
import { PlayerService } from '@/src/handlers/player/player.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ConnectionGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly connectionService: ConnectionService,

    private readonly messageSenderService: MessageSenderService,
    private readonly playerService: PlayerService,
  ) {}

  @SubscribeMessage('connect:create')
  create(
    @MessageBody() createConnectionDto: CreateConnectionDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { name } = createConnectionDto;

    const code = this.connectionService.create(createConnectionDto, socket);

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

    if (!this.connectionService.isRoomExists(this.server, code)) {
      this.messageSenderService.sendMessageToSender(
        socket,
        'connect:error',
        'Rossz csatlakozási kód!',
      );
      return;
    }

    if (this.connectionService.getRoomSize(this.server, code) >= MAX_PLAYER) {
      this.messageSenderService.sendMessageToSender(
        socket,
        'connect:error',
        'A váró megtelt!',
      );
      return;
    }

    if (this.connectionService.isGameStarted(code)) {
      this.messageSenderService.sendMessageToSender(
        socket,
        'connect:error',
        'Sikertelen csatlakozás. A játék elkezdődött!',
      );
      return;
    }

    this.connectionService.join(socket, joinConnectionDto);

    this.messageSenderService.sendMessageToSender(socket, 'connect:error', '');
    this.messageSenderService.sendMessageToSender(socket, 'connect:code', {
      code,
    });

    this.playerService.newPlayerMessage(this.server, socket, code, name);
  }

  @SubscribeMessage('connect:disconnect')
  disconnect(@ConnectedSocket() socket: Socket) {
    this.connectionService.disconnect(this.server, socket);
  }

  afterInit() {
    this.server.on('connection', (socket: Socket) => {
      socket.on('disconnecting', () => {
        this.connectionService.disconnect(this.server, socket);
      });
    });
  }
}
