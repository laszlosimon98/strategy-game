import { Socket } from "socket.io";

import { Indices } from "@/utils/indices";
import { settings } from "@/settings";

export class Validator {
  private constructor() {}

  public static validateIndices(indices: Indices): boolean {
    return (
      indices.i > -1 &&
      indices.i < settings.mapSize &&
      indices.j > -1 &&
      indices.j < settings.mapSize
    );
  }

  public static canPlayerDemolishOwnBuilding(
    socket: Socket,
    owner: string
  ): boolean {
    return socket.id === owner;
  }
}
