import { GameStatus } from "@/src/game/enums/gameStatus";
import { Dimension } from "@/src/game/utils/dimension";
import { Indices } from "@/src/game/utils/indices";
import { Position } from "@/src/game/utils/position";
import { Building } from "@/src/game/world/building/building";
import { Unit } from "@/src/game/world/unit/unit";
import { Soldier } from "@/src/game/world/unit/units/soldier";
import {
  PlayerIdType,
  ServerHouseType,
  EntityType,
  PlayerType,
} from "@/src/services/types/gameTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type GameState = {
  data: {
    worldSize: number;
    state: GameStatus;
    players: PlayerIdType;
    builder: {
      selectedHouse: ServerHouseType;
    };
  };
};

const initialState: GameState = {
  data: {
    worldSize: 0,
    state: GameStatus.Default,
    players: {},
    builder: {
      selectedHouse: {
        url: "",
        dimensions: {
          width: 0,
          height: 0,
        },
      },
    },
  },
};

export const initEntity: EntityType = {
  data: {
    dimensions: Dimension.zero(),
    position: Position.zero(),
    indices: Indices.zero(),
    id: "",
    owner: "",
    static: "",
    url: "",
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setPlayer: (
      state,
      action: PayloadAction<{ id: string; player: PlayerType }>
    ) => {
      const { id, player } = action.payload;

      state.data.players[id] = player;
    },
    setSelectedHouse: (state, action: PayloadAction<ServerHouseType>) => {
      state.data.builder.selectedHouse = action.payload;
    },
    setGameState: (state, action: PayloadAction<GameStatus>) => {
      state.data.state = action.payload;
    },
    resetBuilder: (state) => {
      state.data.builder = {
        selectedHouse: {
          url: "",
          dimensions: {
            width: 0,
            height: 0,
          },
        },
      };
    },
    addUnit: (state, action: PayloadAction<{ id: string; unit: Soldier }>) => {
      const { id, unit } = action.payload;

      state.data.players[id].units.push(unit);
    },
    addMovingUnit: (
      state,
      action: PayloadAction<{ id: string; unit: Unit }>
    ) => {
      const { id, unit } = action.payload;

      state.data.players[id].movingUnits.push(unit);
    },
    removeUnit: (state, action: PayloadAction<Unit>) => {},
    removeMovingUnit: (
      state,
      action: PayloadAction<{ id: string; removingUnit: Unit }>
    ) => {
      const { id, removingUnit } = action.payload;

      state.data.players[id].movingUnits.filter(
        (unit) => unit !== removingUnit
      );

      console.log(state.data.players[id].movingUnits);
    },
    addBuilding: (
      state,
      action: PayloadAction<{ id: string; building: Building }>
    ) => {
      const { id, building } = action.payload;
      state.data.players[id].buildings.push(building);
    },
  },
});

export const {
  setPlayer,
  setSelectedHouse,
  setGameState,
  resetBuilder,
  addUnit,
  addMovingUnit,
  removeUnit,
  removeMovingUnit,
  addBuilding,
} = gameSlice.actions;

export default gameSlice.reducer;
