import Icon from "@/src/features/gamepage/components/icon";
import { imagesFromState } from "@/src/game/data/state";
import { GameStatus } from "@/src/game/enums/game-status";
import { useAppDispatch } from "@/src/services/hooks/store.hooks";
import {
  setSelectedHouse,
  setGameState,
} from "@/src/services/slices/game.slice";
import { setModalVisibility } from "@/src/services/slices/modal.slice";
import { ReactElement } from "react";

const Modal = (): ReactElement => {
  const dispatch = useAppDispatch();

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-amber-900 rounded-2xl shadow-2xl shadow-amber-800"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-evenly flex-wrap">
        <Icon
          url={imagesFromState.buildings.woodcutter.url}
          onClick={() => {
            dispatch(setSelectedHouse(imagesFromState.buildings.woodcutter));
            dispatch(setModalVisibility(false));
            dispatch(setGameState(GameStatus.Build));
          }}
        />
        <Icon
          url={imagesFromState.buildings.stonecutter.url}
          onClick={() => {
            dispatch(setSelectedHouse(imagesFromState.buildings.stonecutter));
            dispatch(setModalVisibility(false));
            dispatch(setGameState(GameStatus.Build));
          }}
        />
      </div>
    </div>
  );
};

export default Modal;
