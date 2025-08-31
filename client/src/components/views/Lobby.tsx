import { Button } from "@/components/ui/button";
import { ServerHandler } from "@/server/server-handler";
import { useAppSelector, useAppDispatch } from "@/services/hooks/store.hooks";
import {
  setMessage,
  addPlayersToLobby,
  removePlayerFromLobby,
  setImages,
} from "@/services/slices/init.slice";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Lobby = () => {
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

      console.log(images);

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
    <div>
      {/* <PageTitle>Váró</PageTitle> */}

      <div>
        {info && (
          <p
            className={`text-center text-lg font-semibold sm:pt-4 ${
              info.type === "connect" ? "text-green-700" : "text-red-700"
            }`}
          >
            {info.message}
          </p>
        )}
        <p>Kód: {String(code)}</p>
        <h2>Csatlakozott játékosok</h2>
        {/* <PlayersContainer> */}
        {players &&
          players.map((player, index) => <div key={index}>{player}</div>)}
        {/* </PlayersContainer> */}
      </div>

      <div>
        <Link to={`/`}>
          <Button onClick={handleLeave}>Vissza</Button>
        </Link>

        <Button>Kész</Button>

        <Button onClick={handleStart}>Indítás</Button>
      </div>
    </div>
  );
};

export default Lobby;
