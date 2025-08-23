import { imagesFromState } from "@/game/data/state";
import Icon from "@/view/gamepage/components/Icon";
import { ReactElement } from "react";
import { useAppDispatch } from "services/hooks/storeHooks";
import { setModalVisibility } from "services/slices/modalSlice";

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
