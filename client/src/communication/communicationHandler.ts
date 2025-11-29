import { io, Socket } from "socket.io-client";

/**
 * Üzenet küldő osztály.
 * Üzenet küldés és fogadás.
 */
export class CommunicationHandler {
  private static socket: Socket;
  private constructor() {}

  /**
   * Lekéri az aktuálist klienst
   * @returns aktuális kliens
   */
  private static getInstance(): Socket {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_SERVER_URL);
    }
    return this.socket;
  }

  public static getId(): string {
    return this.getInstance().id as string;
  }

  /**
   * Üzenetetcsomagot küld a feliratkozott eseményen.
   * @param event esemény
   * @param data adat
   */
  public static sendMessage(event: string, data: any): void {
    this.getInstance().emit(event, data);
  }

  /**
   * Fogadja az üzenetcsomagot, és aszinkron módon kezeli
   * @param event esemény
   * @returns
   */
  public static receiveAsyncMessage(event: string): Promise<any> {
    return new Promise((resolve) => {
      this.getInstance().once(event, (data: any) => {
        resolve(data);
      });
    });
  }

  /**
   * Fogadja az üzenetcsomagot
   * @param event esemény
   * @param callback függvény, ami végrehajtódik
   */
  public static receiveMessage(event: string, callback: Function): void {
    this.getInstance().on(event, (data: any) => callback(data));
  }
}
