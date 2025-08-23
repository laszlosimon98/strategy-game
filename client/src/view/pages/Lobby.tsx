import Button from "@/view/components/Button";
import PageTitle from "@/view/components/PageTitle";
import PlayersContainer from "@/view/components/PlayersContainer";
import { ReactElement, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ServerHandler } from "server/serverHandler";
import { useAppDispatch, useAppSelector } from "services/hooks/storeHooks";
import {
  addPlayersToLobby,
  removePlayerFromLobby,
  setImages,
  setMessage,
} from "services/slices/utilsSlice";

const Lobby = (): ReactElement => {
  const location = useLocation();
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

    ServerHandler.receiveMessage(
      "connect:playerLeft",
      ({ name, message }: { name: string; message: string }) => {
        dispatch(removePlayerFromLobby(name));
        dispatch(setMessage({ message, type: "leave" }));
      }
    );

    const fetchImages = async () => {
      ServerHandler.sendMessage("game:images", {});
      const images = await ServerHandler.receiveAsyncMessage("game:images");
      dispatch(setImages(images));

      ServerHandler.receiveMessage("game:starts", () => {
        navigate("/game");
      });
    };
    fetchImages();

    return () => {
      ServerHandler.removeListener("connect:newPlayer");
      ServerHandler.removeListener("connect:playerLeft");
      ServerHandler.removeListener("start:images");
      ServerHandler.removeListener("game:starts");
    };
  }, [dispatch, navigate]);

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
        <p className="text-2xl">Kód: {code}</p>
        <h2 className="text-xl font-semibold">Csatlakozott játékosok</h2>
        <PlayersContainer>
          {players &&
            players.map((player, index) => <div key={index}>{player}</div>)}
        </PlayersContainer>
      </div>

      <div className="flex justify-around mb-16 mt-1 flex-wrap gap-6 sm:mt-4">
        <Link to={`${location.state.redirectTo}`}>
          <Button radius="rounded" onClick={handleLeave}>
            Vissza
          </Button>
        </Link>

        <Button radius="rounded">Kész</Button>

        <Link to="/game">
          <Button radius="rounded" onClick={handleStart}>
            Indítás
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Lobby;
