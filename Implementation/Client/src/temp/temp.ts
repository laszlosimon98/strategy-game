import { io, Socket } from "socket.io-client";

class Cell {
  private i: number;
  private j: number;
  private asdf: string;

  constructor(i: number, j: number) {
    this.i = i;
    this.j = j;
    this.asdf = "asdf";
  }

  getCoords() {
    return {
      x: this.i,
      y: this.j,
    };
  }
}

export const serverCommunication = () => {
  const socket: Socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log(socket.id);
  });

  const c = new Cell(1, 1);

  socket.emit("cell", c);
};
