import { Server, Socket } from "socket.io";

export const gameHandler = (io: Server, socket: Socket) => {
  const getCurrentRoom = () => Array.from(socket.rooms)[1];

  const sendMessageToEveryOne = (event: string, data: any) => {
    io.to(getCurrentRoom()).emit(event, data);
  };

  const sendMessageToSender = (event: string, data: any) => {
    socket.emit(event, data);
  };

  const sendMessageToEveryOneExceptSender = (event: string, data: any) => {
    socket.broadcast.to(getCurrentRoom()).emit(event, data);
  };

  const gameStarts = () => {
    console.log(`Current room: ${getCurrentRoom()}`);
    sendMessageToEveryOneExceptSender("game:starts", {});
    sendMessageToEveryOne("game:createWorld", { message: "hello" });
    sendMessageToEveryOne("asdf", "asdf");

    setTimeout(() => {
      sendMessageToEveryOne("asdf", "Hello");
    }, 3000);
  };

  socket.on("game:starts", gameStarts);
};
