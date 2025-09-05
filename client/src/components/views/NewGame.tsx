import ButtonContainer from "@/components/custom/ButtonContainer";
import HeaderContainer from "@/components/custom/HeaderContainer";
import PageTitle from "@/components/custom/PageTitle";
import PageTitleContainer from "@/components/custom/PageTitleContainer";
import { Button } from "@/components/ui/button";
import { ServerHandler } from "@/server/server-handler";
import { useAppSelector, useAppDispatch } from "@/services/hooks/store.hooks";
import {
  setCode,
  setHost,
  setMessage,
  addPlayersToLobby,
} from "@/services/slices/init.slice";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NewGame = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const name = useAppSelector((state) => state.utils.data.player.name);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    ServerHandler.sendMessage("connect:create", { name });

    const { code } = await ServerHandler.receiveAsyncMessage("connect:code");
    const { players, message } = await ServerHandler.receiveAsyncMessage(
      "connect:newPlayer"
    );

    if (code && players) {
      dispatch(setCode(code));
      dispatch(setHost(true));

      dispatch(setMessage({ message, type: "connect" }));
      dispatch(addPlayersToLobby(players));

      navigate("/lobby", { state: { redirectTo: location.pathname } });
    } else {
      setError("Sikertelen csatlakozás!");
    }
  };

  return (
    <div className="h-dvh">
      <HeaderContainer>
        <PageTitleContainer>
          <PageTitle title="Új játék" />
        </PageTitleContainer>
      </HeaderContainer>

      <ButtonContainer>
        <Button onClick={handleCreate}>Létrehozás</Button>

        <Link to="/join-game">
          <Button className="w-full">Csatlakozás</Button>
        </Link>

        <Link to="/">
          <Button className="w-full">Vissza</Button>
        </Link>
      </ButtonContainer>
    </div>
  );
};

export default NewGame;
