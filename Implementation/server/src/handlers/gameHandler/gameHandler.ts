import { Server, Socket } from "socket.io";
import { handlePathFind } from "./components/pathFind";
import { handleStart } from "./components/start";
import { handleBuildings } from "./components/buildings";
import { handleUnits } from "./components/units";

export const gameHandler = (io: Server, socket: Socket) => {
  handleStart(io, socket);
  handlePathFind(io, socket);
  handleBuildings(io, socket);
  handleUnits(io, socket);
};
