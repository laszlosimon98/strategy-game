import { PlayerType } from "@/services/types/game.types";
import { LobbyType, ImageType } from "@/services/types/init.types";
import { faker } from "@faker-js/faker/locale/hu";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitState = {
  data: {
    player: PlayerType;
    lobby: LobbyType;
    images: ImageType;
  };
};

const initialState: InitState = {
  data: {
    player: {
      name: faker.person.firstName(),
      host: false,
      code: "",
      buildings: [],
      color: "",
      movingUnits: [],
      units: [],
    },
    lobby: {
      players: [],
      info: {
        message: "",
        type: "connect",
      },
    },
    images: {
      buildings: {},
      ui: {},
      colors: {},
      ground: {},
      obstacles: {},
    },
  },
};

export const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.data.player.name = action.payload;
    },
    setHost: (state, action: PayloadAction<boolean>) => {
      state.data.player.host = action.payload;
    },
    setCode: (state, action: PayloadAction<string>) => {
      state.data.player.code = action.payload;
    },
    setMessage: (
      state,
      action: PayloadAction<{ message: string; type: "connect" | "leave" }>
    ) => {
      state.data.lobby.info = action.payload;
    },
    setImages: (state, action: PayloadAction<any>) => {
      state.data.images = action.payload;
    },
    addPlayersToLobby: (state, action: PayloadAction<string[]>) => {
      state.data.lobby.players = action.payload;
    },
    removePlayerFromLobby: (state, action: PayloadAction<string>) => {
      state.data.lobby.players = state.data.lobby.players.filter(
        (player) => player !== action.payload
      );
    },
  },
});

export const {
  setName,
  setHost,
  setMessage,
  setCode,
  setImages,
  addPlayersToLobby,
  removePlayerFromLobby,
} = utilsSlice.actions;
export default utilsSlice.reducer;
