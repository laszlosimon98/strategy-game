import { Building } from "@/classes/game/building";
import { getImageNameFromUrl } from "@/classes/utils/utils";
import { StateType } from "@/types/state.types";
import { Socket } from "socket.io";

export class BuildingManager {
  private constructor() {}

  public static createBuilding(
    room: string,
    socket: Socket,
    state: StateType,
    building: Building
  ): void {
    console.log(getImageNameFromUrl(building.getEntity().data.url));
    state[room].players[socket.id].buildings.push(building);
  }

  public static getBuildings(
    room: string,
    socket: Socket,
    state: StateType
  ): Building[] {
    return [...state[room].players[socket.id].buildings];
  }

  public static getBuilding(
    room: string,
    socket: Socket,
    state: StateType,
    building: Building
  ): Building | undefined {
    const buildings: Building[] = this.getBuildings(room, socket, state);
    return buildings.find(
      (b) => b.getEntity().data.id === building.getEntity().data.id
    );
  }

  public static destroyBuilding(
    room: string,
    socket: Socket,
    state: StateType,
    building: Building
  ): void {
    const buildingToDemolish: Building | undefined = this.getBuilding(
      room,
      socket,
      state,
      building
    );

    if (!buildingToDemolish) return;

    const buildingIndex: number = state[room].players[
      socket.id
    ].buildings.findIndex(
      (b) => b.getEntity().data.id === buildingToDemolish.getEntity().data.id
    );

    if (buildingIndex === -1) return;

    state[room].players[socket.id].buildings.splice(buildingIndex, 1);
  }
}
