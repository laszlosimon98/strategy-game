import Button from "@/src/features/components/Button";
import Input from "@/src/features/components/Input";
import PageTitle from "@/src/features/components/PageTitle";
import { ServerHandler } from "@/src/server/serverHandler";
import {
  useAppSelector,
  useAppDispatch,
} from "@/src/services/hooks/storeHooks";
import {
  setCode,
  setMessage,
  addPlayersToLobby,
} from "@/src/services/slices/utilsSlice";
import { ReactElement, useState, ChangeEvent } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Join = (): ReactElement => {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const name = useAppSelector((state) => state.utils.data.player.name);
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const handleJoin = async () => {
    ServerHandler.sendMessage("connect:join", { code: input, name });

    ServerHandler.receiveMessage("connect:error", (data) => {
      setError(data);
    });

    const { players, message } = await ServerHandler.receiveAsyncMessage(
      "connect:newPlayer"
    );

    if (input && players) {
      dispatch(setCode(input));

      dispatch(setMessage({ message, type: "connect" }));
      dispatch(addPlayersToLobby(players));

      navigate("/lobby", { state: { redirectTo: location.pathname } });
    }
  };

  return (
    <div className="w-full h-dvh flex flex-col justify-between">
      <PageTitle>Csatlakozás</PageTitle>

      <div className="w-full flex flex-col justify-center mx-auto gap-2">
        {error && <p className="text-red-700 self-center text-lg">{error}</p>}
        <Input
          label="Játék kód"
          onChange={(e) =>
            setInput((e as ChangeEvent<HTMLInputElement>).target.value)
          }
          value={input}
        />
      </div>

      <div className="flex justify-around items-end mb-16">
        <Link to="/newgame">
          <Button radius="rounded">Vissza</Button>
        </Link>

        <Button radius="rounded" onClick={handleJoin}>
          Csatlakozás
        </Button>
      </div>
    </div>
  );
};

export default Join;
