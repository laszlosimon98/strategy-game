import HeaderContainer from "@/components/custom/HeaderContainer";
import PageTitle from "@/components/custom/PageTitle";
import PageTitleContainer from "@/components/custom/PageTitleContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    <div className="h-dvh">
      <HeaderContainer>
        <PageTitleContainer>
          <PageTitle title="Játék váró" />
        </PageTitleContainer>
      </HeaderContainer>

      {info && (
        <p
          className={`text-center text-lg font-semibold pt-8 ${
            info.type === "connect" ? "text-green-700" : "text-red-700"
          }`}
        >
          {info.message}
        </p>
      )}

      <div className="max-w-xl mx-auto h-[70vh]">
        <div className="text-center mt-6">
          <Badge className="min-h-fit w-32 h-8 text-xl">{code as string}</Badge>
        </div>

        <h2 className="text-center font-semibold text-lg mt-20">
          Csatlakozott játékosok
        </h2>

        <div className="bg-primary py-5 rounded-lg shadow-xl h-[25vh] my-4 overflow-y-auto scrollbar-custom">
          {players &&
            players.map((player, index) => (
              <div
                key={index}
                className="flex mx-auto max-w-sm justify-between py-2"
              >
                <div className="text-primary-foreground">{player}</div>
                {/* TODO:  */}
                <div className={cn("text-green-500")}>Kész</div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-around">
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
