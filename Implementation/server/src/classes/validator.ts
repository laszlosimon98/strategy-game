import { Socket } from "socket.io";
import { MAP_SIZE } from "../settings";
import { Indices } from "./utils/indices";

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

  public static isSenderAndOwnerSame(socket: Socket, owner?: string): boolean {
    return socket.id === owner;
  }
}
