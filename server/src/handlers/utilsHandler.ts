import { Server, Socket } from "socket.io";

import { ServerHandler } from "@/classes/serverHandler";
import { StateManager } from "@/manager/stateManager";

export const utilsHandler = async (io: Server, socket: Socket, images: any) => {
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
