import { io, Socket } from "socket.io-client";

export class ServerHandler {
  private static socket: Socket;
  private constructor() {}

  private static getInstance(): Socket {
    if (!this.socket) {
      this.socket = io("http://localhost:3000");
      // this.socket = io("http://192.168.1.70:3000");
    }

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
      const handler = (data: any) => {
        // Távolítsuk el a listener-t a válasz megérkezése után
        this.getInstance().off(event, handler);
        resolve(data);
      };
      this.getInstance().on(event, handler);
    });
  }

  public static receiveMessage(
    event: string,
    callback: (data: any) => void
  ): void {
    this.getInstance().on(event, (data: any) => callback(data));
  }

  public static removeListener(event: string): void {
    this.getInstance().off(event);
  }
}
