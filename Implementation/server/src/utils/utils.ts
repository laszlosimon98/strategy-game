import { Server, Socket } from "socket.io";

export const getCurrentRoom = (socket: Socket) => Array.from(socket.rooms)[1];

export const sendMessageToEveryOne = (
  io: Server,
  socket: Socket,
  event: string,
  data: any
) => {
  io.to(getCurrentRoom(socket)).emit(event, data);
};

export const sendMessageToSender = (
  socket: Socket,
  event: string,
  data: any
) => {
  socket.emit(event, data);
};

export const sendMessageToEveryOneExceptSender = (
  socket: Socket,
  event: string,
  data: any
) => {
  socket.broadcast.to(getCurrentRoom(socket)).emit(event, data);
};
