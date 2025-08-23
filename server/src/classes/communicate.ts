import { Server, Socket } from "socket.io";

export class Communicate {
  private constructor() {}

  /**
   *
   * @param {Socket} socket kliens Socket.IO kapcsolata
   * @returns A socket által használt szoba azonosítója
   */
  public static getCurrentRoom(socket: Socket): string {
    return Array.from(socket.rooms)[1];
  }

  /**
   * Mindenkinek üzenetet küld akik ugyanabban a szobában vannak
   * @param {Server} io szerver
   * @param {Socket} socket kliens
   * @param {string} event event név
   * @param {any} data üzenet
   */
  public static sendMessageToEveryOne(
    io: Server,
    socket: Socket,
    event: string,
    data: any
  ): void {
    io.in(this.getCurrentRoom(socket)).emit(event, data);
  }

  /**
   * Csak a küldőnek küld üzenetet, az adott szobában
   * @param {Socket} socket kliens
   * @param {string} event event név
   * @param {any} data üzenet
   */
  public static sendMessageToSender(
    socket: Socket,
    event: string,
    data: any
  ): void {
    socket.emit(event, data);
  }

  /**
   * Privát üzenetet küld a megadott id-ra
   * @param {Server} io Szerver
   * @param {string} id egyedi azonosító
   * @param {string} event event név
   * @param {any} data üzenet
   */
  public static sendPrivateMessage(
    io: Server,
    id: string,
    event: string,
    data: any
  ): void {
    io.to(id).emit(event, data);
  }

  /**
   * A küldőn kívül mindenkinek küld üzenetet, egy megadott szobában
   * @param {Socket} socket Kliens
   * @param {string} event event név
   * @param {any} data üzenet
   */
  public static sendMessageToEveryOneExceptSender(
    socket: Socket,
    event: string,
    data: any
  ): void {
    socket.broadcast.to(this.getCurrentRoom(socket)).emit(event, data);
  }
}
