import { Communicate } from "../classes/communicate";
import { Server, Socket } from "socket.io";
import { Loader } from "../classes/imageLoader";
import path from "path";

export const imageHandler = async (io: Server, socket: Socket) => {
  const getImages = async () => {
    const images = await Loader.loadImages(
      path.join(__dirname, "..", "..", "/public/assets")
    );

    return images;
  };

  const images = async () => {
    const images = await getImages();
    Communicate.sendMessageToSender(socket, "game:images", images);
  };

  socket.on("game:images", images);
};

export const imageHandler2 = async (
  io: Server,
  socket: Socket,
  images: any
) => {
  const page = () => {
    Communicate.sendMessageToSender(socket, "start:page", images);
  };

  page();
};
