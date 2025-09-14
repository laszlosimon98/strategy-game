import { Server, Socket } from "socket.io";

import { ServerHandler } from "@/classes/serverHandler";

export const imageHandler = async (io: Server, socket: Socket, images: any) => {
  const page = () => {
    ServerHandler.sendMessageToSender(socket, "start:page", images);
  };

  page();
};
