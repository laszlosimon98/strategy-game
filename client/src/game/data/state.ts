import { GameStatus } from "@/src/game/enums/game-status";
import { getState } from "@/src/services/store";
import { PlayerIdType, ServerHouseType } from "@/src/services/types/game.types";
import { ImageType } from "@/src/services/types/init.types";

export let imagesFromState: ImageType;
export let playersFromState: PlayerIdType;
export let gameStatus: GameStatus;
export let builder: { selectedHouse: ServerHouseType };

getState(
  (state) => state.utils.data.images,
  (data) => {
    imagesFromState = data;
  }
);

getState(
  (state) => state.game.data.players,
  (data) => {
    playersFromState = data;
  }
);

getState(
  (state) => state.game.data.state,
  (data) => {
    gameStatus = data;
  }
);

getState(
  (state) => state.game.data.builder,
  (data) => {
    builder = data;
  }
);
