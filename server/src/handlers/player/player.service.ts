import { state } from '@/src/game/data/data';
import { PlayerType } from '@/src/game/types/types';
import { MessageSenderService } from '@/src/handlers/message-sender/message-sender.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@Injectable()
export class PlayerService {
  constructor(
    @Inject(forwardRef(() => MessageSenderService))
    private readonly messageSenderService: MessageSenderService,
  ) {}

  private getPlayerNames(code: string): string[] {
    const result: string[] = [];

    Object.keys(state[code].players).forEach((id) => {
      result.push(state[code].players[id].name);
    });

    return result;
  }

  public getCurrentRoom(socket: Socket): string {
    return Array.from(socket.rooms)[1];
  }

  public getPlayersInRoom(socket: Socket): PlayerType {
    const currentRoom: string = this.getCurrentRoom(socket);
    return state[currentRoom].players;
  }

  public newPlayerMessage(
    server: Server,
    socket: Socket,
    code: string,
    name: string,
  ): void {
    const names = this.getPlayerNames(code);

    this.messageSenderService.sendMessageToEveryOneInRoom(
      server,
      socket,
      'connect:newPlayer',
      {
        players: names,
        message: `${name} csatlakozott a váróhoz!`,
      },
    );
  }

  public playerLeftMessage(server: Server, socket: Socket, name: string): void {
    this.messageSenderService.sendMessageToEveryOneInRoom(
      server,
      socket,
      'connect:playerLeft',
      {
        name,
        message: `${name} elhagyta a várót!`,
      },
    );
  }
}
