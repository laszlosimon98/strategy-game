import { io, Socket } from "socket.io-client";

export class ServerHandler {
  private static readonly socket: Socket = io("http://localhost:3000");
  private constructor() {}

  static sendMessage(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  static receiveAsyncMessage(event: string): Promise<any> {
    return new Promise((resolve) => {
      this.socket.on(event, (data: any) => {
        resolve(data);
      });
      setTimeout(() => {
        resolve("");
      }, 100);
    });
  }

  static receiveMessage(event: string, callback: Function): void {
    this.socket.on(event, (data: any) => callback(data));
  }
}
