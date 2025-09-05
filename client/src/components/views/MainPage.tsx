import NamePlate from "@/components/custom/NamePlate";
import PageTitle from "@/components/custom/PageTitle";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/services/hooks/store.hooks";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import ButtonContainer from "@/components/custom/ButtonContainer";
import HeaderContainer from "@/components/custom/HeaderContainer";
import PageTitleContainer from "@/components/custom/PageTitleContainer";

const MainPage = () => {
  const name = useAppSelector((state) => state.utils.data.player.name);

  return (
    <div className="h-dvh">
      <HeaderContainer>
        <NamePlate name={name} />

        <PageTitleContainer>
          <PageTitle title="Főoldal" />
        </PageTitleContainer>

        <Button size="icon" className="w-12 h-12">
          <User className="scale-150" />
        </Button>
      </HeaderContainer>

      <ButtonContainer>
        <Link to="new-game" className="block">
          <Button className="w-full">Új játék</Button>
        </Link>

        <Link to="description" className="block">
          <Button className="w-full">Játékmenet</Button>
        </Link>

        <Link to="statistic" className="block">
          <Button className="w-full">Statisztika</Button>
        </Link>
      </ButtonContainer>
    </div>
  );
};

export default MainPage;
