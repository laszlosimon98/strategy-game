import { CommunicationHandler } from "@/communication/communicationHandler";
import { ColorType } from "@/types/state.types";
import { Server, Socket } from "socket.io";

/**
 * Üzenet küldésért felelős függvény
 * @param io Socket.IO szerver
 * @param socket csatlakozott kliens
 */
export const handleChat = (io: Server, socket: Socket) => {
  /**
   * Fogadja és tovább küldi az üzenetet a többi játékosnak a szobában
   * @param param0 üzenet, küldő neve, küldő színe
   */
  const receiveMessage = ({
    message,
    name,
    color,
  }: {
    message: string;
    name: string;
    color: ColorType;
  }) => {
    CommunicationHandler.sendMessageToEveryOne(io, socket, "chat:message", {
      message,
      name,
      color,
    });
  };

  socket.on("chat:message", receiveMessage);
};
