import { io, Socket } from "socket.io-client";

export class ServerHandler {
  private static readonly socket: Socket = io("http://localhost:3000");
  private constructor() {}

  static sendMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }

  static receiveMessage(event: string, callback: Function) {
    this.socket.on(event, (data: any) => callback(data));
  }

  static getId(): string | undefined {
    return this.socket.id;
  }
}
