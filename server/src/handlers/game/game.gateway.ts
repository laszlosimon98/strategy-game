import { Indices } from '@/src/game/classes/indices';
import { PlayerType } from '@/src/game/types/types';
import { GameService } from '@/src/handlers/game/game.service';
import { MessageSenderService } from '@/src/handlers/message-sender/message-sender.service';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly messageSenderService: MessageSenderService,
    private readonly gameService: GameService,
  ) {}

  private sendPlayerPositions(
    players: PlayerType,
    startPositions: { i: number; j: number }[],
  ): void {
    Object.keys(players).forEach((id) => {
      const index = Math.floor(Math.random() * startPositions.length);
      const { i, j } = startPositions.splice(index, 1)[0];
      const pos = new Indices(i, j);
      this.messageSenderService.sendPrivateMessage(
        this.server,
        id,
        'game:startPos',
        pos,
      );
    });
  }

  @SubscribeMessage('game:starts')
  public handleStart(@ConnectedSocket() socket) {
    this.messageSenderService.sendMessageToEveryOneInRoom(
      this.server,
      socket,
      'game:starts',
      {},
    );
  }

  @SubscribeMessage('game:init')
  public initPlayers(@ConnectedSocket() socket) {
    const { players, startPositions, obstacles, tiles } =
      this.gameService.startGame(socket);

    this.messageSenderService.sendMessageToEveryOneInRoom(
      this.server,
      socket,
      'game:initPlayers',
      players,
    );

    this.messageSenderService.sendMessageToEveryOneInRoom(
      this.server,
      socket,
      'game:createWorld',
      { tiles, obstacles },
    );

    this.sendPlayerPositions(players, startPositions);
  }
}
