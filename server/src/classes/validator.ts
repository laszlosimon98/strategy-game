import { Socket } from "socket.io";

import { Indices } from "@/classes/utils/indices";
import { MAP_SIZE } from "@/settings";

export class Validator {
  private constructor() {}

  public static validateIndices(indices: Indices): boolean {
    return (
      indices.i > -1 &&
      indices.i < MAP_SIZE &&
      indices.j > -1 &&
      indices.j < MAP_SIZE
    );
  }

  public static areSenderAndOwnerSame(socket: Socket, owner?: string): boolean {
    return socket.id === owner;
  }
}
