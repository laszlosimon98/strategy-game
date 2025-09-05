import Icon from "@/components/custom/Icon";
import { useAppSelector } from "@/services/hooks/store.hooks";

const GamePanel = () => {
  const { images } = useAppSelector((state) => state.utils.data);

  return (
    <div className="absolute bg-primary flex items-center h-1/2 translate-y-1/2 w-32 rounded-r-xl">
      <Icon house={images.buildings.woodcutter} scale={0.5} />
      <Icon house={images.buildings.stonecutter} scale={0.5} />
      <Icon house={images.buildings.sawmill} scale={0.5} />
    </div>
  );
};

export default GamePanel;
