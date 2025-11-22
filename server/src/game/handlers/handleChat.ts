import { CommunicationHandler } from "@/communication/communicationHandler";
import { ColorType } from "@/types/state.types";
import { Server, Socket } from "socket.io";

export const handleChat = (io: Server, socket: Socket) => {
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
