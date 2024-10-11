import path from "path";
import { Loader } from "../classes/loader";
import { Communicate } from "../classes/communicate";
import { Server, Socket } from "socket.io";

export const imageHandler = async (io: Server, socket: Socket) => {
  const images = await Loader.loadImages(
    path.join(__dirname, "..", "..", "/public/assets")
  );

  console.log(images);

  const page = () => {
    Communicate.sendMessageToSender(socket, "start:page", images.pages);
  };

  const game = () => {
    Communicate.sendMessageToEveryOne(io, socket, "start:game", images.game);
  };

  // socket.on("start:page", page);
  page();
  socket.on("start:game", game);
};
