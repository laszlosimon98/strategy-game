import { Socket } from "socket.io";
import { EntityType } from "../../types/types";
import { state } from "../../data/state";
import { Communicate } from "../communicate";
import { Unit } from "../game/unit";

export const getUnit = (
  socket: Socket,
  entity: EntityType
): Unit | undefined => {
  const unit: Unit | undefined = state[
    Communicate.getCurrentRoom(socket)
  ].players[entity.data.owner].units.find(
    (unit) => unit.getEntity().data.id === entity.data.id
  );

  return unit;
};
