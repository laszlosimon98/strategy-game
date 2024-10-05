import { Server, Socket } from "socket.io";
import { MAP_SIZE } from "../settings";
import {
  getCurrentRoom,
  sendMessageToEveryOne,
  sendMessageToEveryOneExceptSender,
} from "../utils/utils";
import { gameState, MapType } from "../gameState";

export const gameHandler = (io: Server, socket: Socket) => {
  const gameStarts = () => {
    sendMessageToEveryOneExceptSender(socket, "game:starts", {});
    sendMessageToEveryOne(io, socket, "game:createWorld", createWorld(socket));
  };

  const checkIfPossibleToBuild = (xPos: number, yPos: number): boolean => {
    return gameState[getCurrentRoom(socket)].world[xPos][yPos].isBlockEmpty;
  };

  const createWorld = (socket: Socket): MapType[][] => {
    const result: MapType[][] = [];

    for (let i = 0; i < MAP_SIZE; ++i) {
      result.push([]);
      for (let j = 0; j < MAP_SIZE; ++j) {
        const r = Math.random();

        let tile: MapType = {
          type: "grass",
          isBlockEmpty: true,
        };

        if (r < 0.15) {
          tile.type = Math.random() < 0.5 ? "flower" : "rock";
        }

        result[i].push(tile);
      }
    }
    gameState[getCurrentRoom(socket)].world = { ...result };
    return result;
  };

  const build = ({
    x,
    y,
    type,
  }: {
    x: number;
    y: number;
    type: string;
  }): void => {
    if (!checkIfPossibleToBuild(x, y)) {
      return;
    }
    gameState[getCurrentRoom(socket)].world[x][y] = {
      ...gameState[getCurrentRoom(socket)].world[x][y],
      building: type,
    };
    sendMessageToEveryOne(io, socket, "game:build", { x, y, type });
  };

  socket.on("game:starts", gameStarts);
  socket.on("game:build", build);
};
