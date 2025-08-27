import Button from "@/src/features/components/button";
import NamePlate from "@/src/features/components/name-plate";
import PageTitle from "@/src/features/components/page-title";
import { useAppSelector } from "@/src/services/hooks/store.hooks";
import { ReactElement } from "react";
import { Link } from "react-router-dom";

const MainPage = (): ReactElement => {
  const name = useAppSelector((state) => state.utils.data.player.name);

  return (
    <div className="relative">
      <PageTitle>Menü</PageTitle>

      <NamePlate className="absolute top-24 left-20">{name}</NamePlate>

      <div className="absolute top-15 right-20 flex flex-col gap-6 ">
        <Link to="login">
          <Button radius="rounded">Bejelentkezés</Button>
        </Link>

        <Link to="register">
          <Button radius="rounded">Regisztráció</Button>
        </Link>
      </div>

      <div className="h-calc-height flex flex-col justify-center items-center gap-6">
        <Link to="/newgame">
          <Button radius="rounded">Új játék</Button>
        </Link>

        <Link to="description">
          <Button radius="rounded">Játékmenet</Button>
        </Link>

        <Link to="statistic">
          <Button radius="rounded">Statisztika </Button>
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
