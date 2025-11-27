import { Socket } from "socket.io";

import { Indices } from "@/utils/indices";
import { settings } from "@/settings";
import { EntityType } from "@/types/state.types";

/**
 * Validátor osztály
 */
export class Validator {
  private constructor() {}

  /**
   * Ellenőrzi, hogy az indexek a pályára esenek-e
   * @param indices vizsgált indexek
   * @returns az indexek a pályán belülre esnek
   */
  public static validateIndices(indices: Indices): boolean {
    return (
      indices.i > -1 &&
      indices.i < settings.mapSize &&
      indices.j > -1 &&
      indices.j < settings.mapSize
    );
  }

  /**
   * Megnézi, hogy egyezik-e a kliens id-ja és az entitás tulajdonosa
   * @param socket csatlakozott kliens
   * @param entity viszgált entitás
   * @returns
   */
  public static verifyOwner(socket: Socket, entity: EntityType): boolean {
    return socket.id === entity.data.owner;
  }
}
