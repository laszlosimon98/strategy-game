import { imagesFromState } from "@/game/data/state";
import { GameStatus } from "@/game/enums/gameStatus";
import Icon from "@/view/gamepage/components/Icon";
import { ReactElement } from "react";
import { useAppDispatch } from "services/hooks/storeHooks";
import { setGameState, setSelectedHouse } from "services/slices/gameSlice";
import { setModalVisibility } from "services/slices/modalSlice";

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
