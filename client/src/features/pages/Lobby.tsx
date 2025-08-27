import Button from "@/src/features/components/Button";
import PageTitle from "@/src/features/components/PageTitle";
import PlayersContainer from "@/src/features/components/PlayersContainer";
import { ServerHandler } from "@/src/server/serverHandler";
import {
  useAppSelector,
  useAppDispatch,
} from "@/src/services/hooks/storeHooks";
import {
  setMessage,
  addPlayersToLobby,
  removePlayerFromLobby,
  setImages,
} from "@/src/services/slices/utilsSlice";
import { ReactElement, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Lobby = (): ReactElement => {
  const navigate = useNavigate();

  const code = useAppSelector((state) => state.utils.data.player.code);
  const { info, players } = useAppSelector((state) => state.utils.data.lobby);

  const dispatch = useAppDispatch();

  const handleLeave = () => {
    ServerHandler.sendMessage("connect:disconnect", {});
  };

  const handleStart = () => {
    ServerHandler.sendMessage("game:starts", {});
  };

  useEffect(() => {
    ServerHandler.receiveMessage("connect:newPlayer", (data) => {
      const { players, message } = data;
      dispatch(setMessage({ message, type: "connect" }));
      dispatch(addPlayersToLobby(players));
    });

    ServerHandler.receiveMessage("connect:playerLeft", (data) => {
      const { name, message } = data;
      dispatch(removePlayerFromLobby(name));
      dispatch(setMessage({ message, type: "leave" }));
    });

    const fetchImages = async () => {
      ServerHandler.sendMessage("game:images", {});
      const images = await ServerHandler.receiveAsyncMessage("game:images");

      ServerHandler.receiveMessage("game:imagesError", (data) => {
        console.error(data);
        return;
      });

      dispatch(setImages(images));
    };
    fetchImages();

    ServerHandler.receiveMessage("game:starts", () => {
      navigate("/game");
    });

    return () => {
      ServerHandler.removeListener("connect:newPlayer");
      ServerHandler.removeListener("connect:playerLeft");
      ServerHandler.removeListener("start:images");
      ServerHandler.removeListener("game:starts");
    };
  }, []);

  return (
    <div className="h-dvh flex flex-col justify-around">
      <PageTitle>Váró</PageTitle>

      <div className="flex flex-col justify-center items-center gap-2">
        {info && (
          <p
            className={`text-center text-lg font-semibold sm:pt-4 ${
              info.type === "connect" ? "text-green-700" : "text-red-700"
            }`}
          >
            {info.message}
          </p>
        )}
        <p className="text-2xl">Kód: {String(code)}</p>
        <h2 className="text-xl font-semibold">Csatlakozott játékosok</h2>
        <PlayersContainer>
          {players &&
            players.map((player, index) => <div key={index}>{player}</div>)}
        </PlayersContainer>
      </div>

      <div className="flex justify-around mb-16 mt-1 flex-wrap gap-6 sm:mt-4">
        <Link to={`/`}>
          <Button radius="rounded" onClick={handleLeave}>
            Vissza
          </Button>
        </Link>

        <Button radius="rounded">Kész</Button>

        <Button radius="rounded" onClick={handleStart}>
          Indítás
        </Button>
      </div>
    </div>
  );
};

export default Lobby;
