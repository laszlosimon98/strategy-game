import { Server, Socket } from "socket.io";

import { ServerHandler } from "@/server/serverHandler";
import { StateManager } from "@/manager/stateManager";

export const handleUtils = async (io: Server, socket: Socket, images: any) => {
  const page = () => {
    ServerHandler.sendMessageToSender(socket, "start:page", images);
  };

  const prices = () => {
    ServerHandler.sendMessageToSender(
      socket,
      "start:prices",
      StateManager.getBuidingPrices()
    );
  };

  socket.on("start:page", page);
  socket.on("start:prices", prices);
};
