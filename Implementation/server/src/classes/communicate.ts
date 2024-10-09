import { Server, Socket } from "socket.io";

export class Communicate {
  private constructor() {}

  public static getCurrentRoom(socket: Socket): string {
    return Array.from(socket.rooms)[1];
  }

  public static sendMessageToEveryOne(
    io: Server,
    socket: Socket,
    event: string,
    data: any
  ): void {
    io.to(this.getCurrentRoom(socket)).emit(event, data);
  }

  public static sendMessageToSender(
    socket: Socket,
    event: string,
    data: any
  ): void {
    socket.emit(event, data);
  }

  public static sendMessageToEveryOneExceptSender(
    socket: Socket,
    event: string,
    data: any
  ): void {
    socket.broadcast.to(this.getCurrentRoom(socket)).emit(event, data);
  }
}
