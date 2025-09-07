import { Server, Socket } from "socket.io";

import { Communicate } from "@/classes/communicate";

export const imageHandler = async (io: Server, socket: Socket, images: any) => {
  const page = () => {
    Communicate.sendMessageToSender(socket, "start:page", images);
  };

  page();
};
