import { io, Socket } from "socket.io-client";
import { globalState } from "../data/data";

export class ServerHandler {
  // private static readonly socket: Socket = io("http://localhost:3000");
  private static socket: Socket;
  private constructor() {}

  private static getInstance(): Socket {
    if (!this.socket) {
      this.socket = io("http://localhost:3000");
    }

    this.socket.once("connect_error", () => {
      globalState.serverStatus = "offline";
    });

    this.socket.on("connect", () => {
      globalState.serverStatus = "online";
    });

    return this.socket;
  }

  static sendMessage(event: string, data: any): void {
    this.getInstance().emit(event, data);
  }

  static receiveAsyncMessage(event: string): Promise<any> {
    return new Promise((resolve) => {
      this.getInstance().on(event, (data: any) => {
        resolve(data);
        console.log("resolved");
      });
      setTimeout(() => {
        resolve("");
      }, 100);
    });
  }

  static receiveMessage(event: string, callback: Function): void {
    this.getInstance().on(event, (data: any) => callback(data));
  }
}
