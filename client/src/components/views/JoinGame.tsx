import HeaderContainer from "@/components/custom/HeaderContainer";
import PageTitle from "@/components/custom/PageTitle";
import PageTitleContainer from "@/components/custom/PageTitleContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServerHandler } from "@/server/server-handler";
import { useAppSelector, useAppDispatch } from "@/services/hooks/store.hooks";
import {
  setCode,
  setMessage,
  addPlayersToLobby,
} from "@/services/slices/init.slice";
import { ChangeEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const JoinGame = () => {
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
    <div className="h-dvh">
      <HeaderContainer>
        <PageTitleContainer>
          <PageTitle title="Csatlakozás" />
        </PageTitleContainer>
      </HeaderContainer>

      <div className="w-full flex flex-col items-center justify-center h-[75vh]">
        <div className="w-xl">
          <Label htmlFor="game-code" className="pb-2">
            Játék kód:
          </Label>
          <Input
            id="game-code"
            placeholder="Játék kód"
            onChange={(e) =>
              setInput((e as ChangeEvent<HTMLInputElement>).target.value)
            }
            value={input}
          />
          {error && <p className="text-red-700 text-right  pt-2 ">{error}</p>}
        </div>
      </div>
      <div className="w-full flex justify-around pt-12">
        <Link to="/new-game">
          <Button>Vissza</Button>
        </Link>

        <Button onClick={handleJoin}>Csatlakozás</Button>
      </div>
    </div>
  );
};

export default JoinGame;
