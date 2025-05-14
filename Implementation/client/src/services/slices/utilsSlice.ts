import { faker } from "@faker-js/faker/locale/hu";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageType, LobbyType, PlayerType } from "services/types/utilTypes";

type UtilsState = {
  data: {
    player: PlayerType;
    lobby: LobbyType;
    images: ImageType;
  };
};

const initialState: UtilsState = {
  data: {
    player: {
      name: faker.person.firstName(),
      host: false,
      code: "",
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
