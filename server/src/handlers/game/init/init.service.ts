import { state } from '@/src/game/data/data';
import { WorldService } from '@/src/handlers/game/world/world.service';
import { PlayerService } from '@/src/handlers/player/player.service';
import { START_POSITIONS } from '@/src/settings';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class InitService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly worldService: WorldService,
  ) {}

  private setGameStartedInRoom(room: string): void {
    state[room].isGameStarted = true;
  }

  public initGame(socket: Socket) {
    const currentRoom: string = this.playerService.getCurrentRoom(socket);

    if (!currentRoom || !state[currentRoom]) {
      throw new BadRequestException(`Játékos kilépett a meccsből!`);
    }

    this.setGameStartedInRoom(currentRoom);

    const startPositions = [...START_POSITIONS];

    const world = this.worldService.createWorld();
    const tiles = this.worldService.getTiles(world);
    const obstacles = this.worldService.getObstacles(world);

    const players = this.playerService.getPlayersInRoom(socket);

    return {
      tiles,
      obstacles,
      players,
      startPositions,
    };
  }
}
