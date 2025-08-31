import { GameStatus } from "@/game/enums/game-status";
import { subscribeState } from "@/services/store";
import { PlayerIdType, ServerHouseType } from "@/services/types/game.types";
import { ImageType } from "@/services/types/init.types";

export let imagesFromState: ImageType;
export let playersFromState: PlayerIdType;
export let gameStatus: GameStatus;
export let builder: { selectedHouse: ServerHouseType };

subscribeState(
  (state) => state.utils.data.images,
  (data) => {
    imagesFromState = data;
  }
);

subscribeState(
  (state) => state.game.data.players,
  (data) => {
    playersFromState = data;
  }
);

subscribeState(
  (state) => state.game.data.state,
  (data) => {
    gameStatus = data;
  }
);

subscribeState(
  (state) => state.game.data.builder,
  (data) => {
    builder = data;
  }
);
