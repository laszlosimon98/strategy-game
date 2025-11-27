import { Server, Socket } from "socket.io";

/**
 * Üzenet küldő osztály, kezeli a kliens és a szerver közötti kapcsolatot
 */
export class CommunicationHandler {
  private constructor() {}

  /**
   * Visszaadja azt a szobát, amiben a socket szerepel
   * @param socket csatlakozott kliens
   * @returns a socket szobájának azonosítója
   */
  public static getCurrentRoom(socket: Socket): string {
    return Array.from(socket.rooms)[1];
  }

  /**
   * Üzenet küldése mindenkinek az adott szobában
   * @param io Socket.IO server
   * @param socket csatlakozott kliens
   * @param event feliratkozott esemény
   * @param data küldendő adatt
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
   * Üzenet küldése a küldőnek
   * @param socket csatlakozott kliens
   * @param event feliratkozott esemény
   * @param data küldendő adatt
   */
  public static sendMessageToSender(
    socket: Socket,
    event: string,
    data: any
  ): void {
    socket.emit(event, data);
  }

  /**
   * Privát üzenet küldése egy megadott id-nak
   * @param io Socket.IO server
   * @param id a kliens id-ja
   * @param event feliratkozott esemény
   * @param data küldendő adatt
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
   * Üzenet küldése mindenkinek, kivéve a küldőnek az adott szobában
   * @param socket csatlakozott kliens
   * @param event feliratkozott esemény
   * @param data küldendő adatt
   */
  public static sendMessageToEveryOneExceptSender(
    socket: Socket,
    event: string,
    data: any
  ): void {
    socket.broadcast.to(this.getCurrentRoom(socket)).emit(event, data);
  }
}
