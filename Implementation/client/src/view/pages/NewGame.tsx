import Button from "@/view/components/Button";
import PageTitle from "@/view/components/PageTitle";
import { ReactElement, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ServerHandler } from "server/serverHandler";
import { useAppDispatch, useAppSelector } from "services/hooks/storeHooks";
import {
  addPlayersToLobby,
  setCode,
  setHost,
  setMessage,
} from "services/slices/utilsSlice";

const NewGame = (): ReactElement => {
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
    <>
      <PageTitle>Új Játék</PageTitle>

      <div className="h-calc-height flex flex-col justify-center items-center gap-16">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col gap-6">
          {/* <Link to="/lobby" state={{ redirectTo: location.pathname }}> */}
          <Button radius="rounded" onClick={handleCreate}>
            Létrehozás
          </Button>
          {/* </Link> */}

          <Link to="/join">
            <Button radius="rounded">Csatlakozás</Button>
          </Link>
        </div>

        <Link to="/">
          <Button radius="rounded">Vissza</Button>
        </Link>
      </div>
    </>
  );
};

export default NewGame;
