import { Cell } from '@/src/game/classes/cell';
import { World } from '@/src/game/classes/world';
import { state } from '@/src/game/data/data';
import { TileType } from '@/src/game/types/types';
import { PlayerService } from '@/src/handlers/player/player.service';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WorldService {
  constructor(private readonly playerService: PlayerService) {}

  public createWorld() {
    const world: Cell[][] = World.createWorld();
    return world;
  }

  public setWorld(world: Cell[][], socket: Socket) {
    state[this.playerService.getCurrentRoom(socket)].world = world;
  }

  public getWorld(socket: Socket): Cell[][] {
    return state[this.playerService.getCurrentRoom(socket)].world;
  }

  public getTiles(world: Cell[][]): TileType[][] {
    const tiles: TileType[][] = world.map((cells) => {
      return cells.map((cell) => cell.getType());
    });

    return tiles;
  }

  // FIXME: nem lesz jó az any
  public getObstacles(world: Cell[][]): any {
    const obstacles: any = world.map((cells) => {
      return cells.map((cell) => cell.getObstacleType());
    });

    return obstacles;
  }
}
