import { io, Socket } from "socket.io-client";

export class ServerHandler {
  private static readonly io: Socket = io("http://localhost:3000");
  private constructor() {}

  static sendMessage(event: string, data: any) {
    this.io.emit(event, data);
  }

  static receiveMessage(event: string): any {
    let result: any;
    this.io.on(event, (data) => (result = data));

    return result;
  }
}
