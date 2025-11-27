import { Socket } from "socket.io";

import { CommunicationHandler } from "@/communication/communicationHandler";
import { StateManager } from "@/manager/stateManager";

/**
 * Elküldi a klienseknek az asseteket és az épület költségeket
 * @param socket csatlakozott kliens
 * @param images assetek
 */
export const handleUtils = (socket: Socket, images: any) => {
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
