import { io, Socket } from "socket.io-client";
import { state } from "../data/state";

export class ServerHandler {
  private static socket: Socket;
  private constructor() {}

  private static getInstance(): Socket {
    if (!this.socket) {
      this.socket = io("http://localhost:3000");
      // this.socket = io("http://192.168.1.70:3000");
    }

    this.socket.once("connect_error", () => {
      state.server.status = "offline";
      return;
    });

    this.socket.on("connect", () => {
      state.server.status = "online";
    });

    return this.socket;
  }

  public static getId(): string {
    return this.getInstance().id as string;
  }

  public static sendMessage(event: string, data: any): void {
    this.getInstance().emit(event, data);
  }

  public static receiveAsyncMessage(event: string): Promise<any> {
    return new Promise((resolve) => {
      this.getInstance().on(event, (data: any) => {
        resolve(data);
      });
    });
  }

  public static receiveMessage(event: string, callback: Function): void {
    this.getInstance().on(event, (data: any) => callback(data));
  }
}
