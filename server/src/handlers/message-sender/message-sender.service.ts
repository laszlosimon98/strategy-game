import { PlayerService } from '@/src/handlers/player/player.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@Injectable()
export class MessageSenderService {
  constructor(
    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
  ) {}

  public sendMessageToEveryOneInRoom(
    server: Server,
    socket: Socket,
    event: string,
    data: any,
  ): void {
    const currentRoom = this.playerService.getCurrentRoom(socket);

    if (currentRoom) {
      server.in(currentRoom).emit(event, data);
    }
  }

  public sendMessageToSender(socket: Socket, event: string, data: any): void {
    socket.emit(event, data);
  }

  public sendPrivateMessage(
    server: Server,
    socketId: string,
    event: string,
    data: any,
  ): void {
    server.to(socketId).emit(event, data);
  }

  public sendMessageToEveryOneExceptSenderInRoom(
    socket: Socket,
    event: string,
    data: any,
  ): void {
    const currentRoom = this.playerService.getCurrentRoom(socket);

    if (currentRoom) {
      socket.broadcast.to(currentRoom).emit(event, data);
    }
  }
}
