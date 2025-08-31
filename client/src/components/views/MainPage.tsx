import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/services/hooks/store.hooks";
import { Link } from "react-router-dom";

const MainPage = () => {
  const name = useAppSelector((state) => state.utils.data.player.name);

  return (
    <div>
      <Link to="new-game">
        <Button>Új játék</Button>
      </Link>

      <Link to="description">
        <Button>Játékmenet</Button>
      </Link>

      <Link to="statistic">
        <Button>Statisztika</Button>
      </Link>
    </div>
  );
};

export default MainPage;
