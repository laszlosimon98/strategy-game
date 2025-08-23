import Icon from "@/src/features/gamepage/components/Icon";
import { imagesFromState } from "@/src/game/data/state";
import { useAppDispatch } from "@/src/services/hooks/storeHooks";
import { setModalVisibility } from "@/src/services/slices/modalSlice";
import { ReactElement } from "react";

const SelectionPanel = (): ReactElement => {
  const dispatch = useAppDispatch();

  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-20 rounded-t-2xl bg-amber-900"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="h-full flex justify-around items-center">
        <Icon
          url={imagesFromState.ui.gamemenu.house.url}
          onClick={() => dispatch(setModalVisibility(true))}
        />
        <Icon url={imagesFromState.ui.gamemenu.storage.url} />
        <Icon url={imagesFromState.ui.gamemenu.population.url} />
      </div>
    </div>
  );
};

export default SelectionPanel;
