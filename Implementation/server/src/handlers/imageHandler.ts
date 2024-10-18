import path from "path";
import { Loader } from "../classes/loader";
import { Communicate } from "../classes/communicate";
import { Server, Socket } from "socket.io";

export const imageHandler = async (io: Server, socket: Socket, images: any) => {
  const page = () => {
    Communicate.sendMessageToSender(socket, "start:page", images);
  };

  page();
};
