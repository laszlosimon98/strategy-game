import { InitService } from '@/src/handlers/game/init/init.service';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
  constructor(private readonly initService: InitService) {}

  public startGame(socket: Socket) {
    return this.initService.initGame(socket);
  }
}
