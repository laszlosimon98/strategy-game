import { ServerHandler } from "@/server/serverHandler";
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
    ServerHandler.sendMessageToEveryOne(io, socket, "chat:sendMessage", {
      message,
      name,
      color,
    });
  };

  socket.on("chat:receiveMessage", receiveMessage);
};
