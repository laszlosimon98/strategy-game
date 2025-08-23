import { Server, Socket } from "socket.io";
import { handlePath } from "./components/handlePath";
import { handleStart } from "./components/handleStart";
import { handleBuildings } from "./components/handleBuildings";
import { handleUnits } from "./components/handleUnits";

export const gameHandler = (io: Server, socket: Socket) => {
  handleStart(io, socket);
  handlePath(io, socket);
  handleBuildings(io, socket);
  handleUnits(io, socket);
};
