import { Socket } from "socket.io";
import { MAP_SIZE } from "../settings";
import { Indices } from "./utils/indices";

export class Validator {
  private constructor() {}

  /**
   *
   * @param indices ellenőrizendő koordináták
   * @returns megnézi, hogy a megadott koordináták a világon belülre esenek
   */
  public static validateIndices(indices: Indices): boolean {
    return (
      indices.i > -1 &&
      indices.i < MAP_SIZE &&
      indices.j > -1 &&
      indices.j < MAP_SIZE
    );
  }

  /**
   *
   * @param {Socket} socket kliens
   * @param {string} owner tulajdonos (épület)
   * @returns megnézi, hogy a kliens és a tulajdonos megegyeznek
   */
  public static areSenderAndOwnerSame(socket: Socket, owner?: string): boolean {
    return socket.id === owner;
  }
}
