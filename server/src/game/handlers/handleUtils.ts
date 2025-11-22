import { Server, Socket } from "socket.io";

import { CommunicationHandler } from "@/communication/communicationHandler";
import { StateManager } from "@/manager/stateManager";

export const handleUtils = (io: Server, socket: Socket, images: any) => {
  const page = () => {
    CommunicationHandler.sendMessageToSender(socket, "start:page", images);
  };

  const prices = () => {
    CommunicationHandler.sendMessageToSender(
      socket,
      "start:prices",
      StateManager.getBuidingPrices()
    );
  };

  socket.on("start:page", page);
  socket.on("start:prices", prices);
};
