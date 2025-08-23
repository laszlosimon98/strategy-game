import { GameStatus } from "@/game/enums/gameStatus";
import { getState } from "@/services/store";
import { PlayerIdType, ServerHouseType } from "@/services/types/gameTypes";
import { ImageType } from "@/services/types/utilTypes";

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
