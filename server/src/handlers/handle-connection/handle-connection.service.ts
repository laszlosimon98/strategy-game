import { Injectable } from '@nestjs/common';
import { CONNECTION_CODE_LENGTH } from '@/src/settings';
import { colors, state } from '@/src/game/data/data';
import { ColorType } from '@/src/game/types/types';
import { Socket } from 'socket.io';
import { CreateConnectionDto } from '@/src/handlers/handle-connection/dto/create-connection.dto';
import { Server } from 'socket.io';
import { JoinConnectionDto } from '@/src/handlers/handle-connection/dto/join-connection.dto';
import { PlayerService } from '@/src/handlers/player/player.service';

@Injectable()
export class HandleConnectionService {
  constructor(private readonly playerService: PlayerService) {}

  private generateCode(codeLength: number): string {
    let result = '';
    for (let i = 0; i < codeLength; ++i) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  private chooseColor = (colors: ColorType[]): ColorType => {
    const randomNumber = Math.floor(Math.random() * colors.length);

    const playerColor = colors[randomNumber];
    colors.splice(randomNumber, 1);
    return playerColor;
  };

  public isRoomExists(server: Server, code: string): boolean {
    return server.sockets.adapter.rooms.has(code);
  }

  public getRoomSize(server: Server, code: string): number {
    return server.sockets.adapter.rooms.get(code)?.size ?? 0;
  }

  public isGameStarted(code: string): boolean {
    return state[code].isGameStarted;
  }

  public create(
    createConnectionDto: CreateConnectionDto,
    socket: Socket,
  ): string {
    const { name } = createConnectionDto;
    const code = this.generateCode(CONNECTION_CODE_LENGTH);

    state[code] = {
      isGameStarted: false,
      players: {},
      world: [],
      remainingColors: [...colors],
    };

    state[code].players[socket.id] = {
      name,
      color: this.chooseColor(state[code].remainingColors),
      buildings: [],
      units: [],
    };

    socket.join(code);

    return code;
  }

  public join(socket: Socket, joinConnectionDto: JoinConnectionDto) {
    const { name, code } = joinConnectionDto;

    state[code].players[socket.id] = {
      name,
      color: this.chooseColor(state[code].remainingColors),
      buildings: [],
      units: [],
    };

    socket.join(code);
  }

  public disconnect(socket: Socket): string {
    const currentRoom = this.playerService.getCurrentRoom(socket);

    console.log('State before leaving: ', state);

    const user = state[currentRoom].players[socket.id];
    state[currentRoom].remainingColors.push(user.color);
    delete state[currentRoom].players[socket.id];
    socket.leave(currentRoom);

    console.log('State after leaving: ', state[currentRoom]);

    return user.name;
  }
}
