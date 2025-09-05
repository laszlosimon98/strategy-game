import { GameStatus } from "@/game/enums/game-status";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/services/hooks/store.hooks";
import { setGameState, setSelectedHouse } from "@/services/slices/game.slice";
import { ServerHouseType } from "@/services/types/game.types";
import { HTMLAttributes, ReactElement } from "react";

type IconProps = HTMLAttributes<HTMLImageElement> & {
  // url: string;
  // width?: number;
  // height?: number;
  house: ServerHouseType;
  scale?: number;
};

const Icon = ({
  house,
  scale,
  className,
  ...props
}: IconProps): ReactElement => {
  const dispatch = useAppDispatch();

  const { width, height } = house.dimensions;

  let currentWidth = width;
  let currentHeight = height;

  if (scale) {
    currentWidth *= scale;
    currentHeight *= scale;
  }

  return (
    <img
      {...props}
      src={house.url}
      className={cn(
        "cursor-pointer hover:scale-110 active:scale-100 transition-all",
        className
      )}
      width={currentWidth}
      height={currentHeight}
      onClick={() => {
        dispatch(setSelectedHouse(house));
        dispatch(setGameState(GameStatus.Build));
      }}
    />
  );
};

export default Icon;
