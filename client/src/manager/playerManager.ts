import type { PlayerGameType, ColorsType, StateType } from "@/types/game.types";

export class PlayerManager {
  private constructor() {}

  public static initPlayers(state: StateType, players: PlayerGameType): void {
    Object.keys(players).forEach((id) => {
      state.game.players[id] = {
        name: players[id].name,
        color: players[id].color,
        buildings: [],
        units: [],
        movingUnits: [],
        storage: players[id].storage,
      };
    });
  }

  public static getPlayers(state: StateType): PlayerGameType {
    return state.game.players;
  }

  public static getPlayerById(
    state: StateType,
    id: string
  ): PlayerGameType[""] {
    return state.game.players[id];
  }

  public static getPlayerColor(state: StateType, id: string): ColorsType {
    return this.getPlayerById(state, id).color;
  }
}
