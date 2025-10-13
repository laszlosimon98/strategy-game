import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";

import { Loader } from "@/classes/imageLoader";
import { utilsHandler } from "@/handlers/utilsHandler";
import { handleBuildings } from "@/handlers/game/handleBuildings";
import { handlePath } from "@/handlers/game/handlePath";
import { handleStart } from "@/handlers/game/handleStart";
import { handleUnits } from "@/handlers/game/handleUnits";
import { connectionHandler } from "@/handlers/connectionHandler";
import { handleProduction } from "@/handlers/game/handleProduction";

const PORT = 3000;

const app = express();
const httpServer = createServer(app);

app.use(express.static(path.join(__dirname, "..", "/public")));

const io: Server = new Server(httpServer, {
  cors: {
    // origin: "*",
    origin: ["http://localhost:5173", "http://192.168.1.70:5173"],
  },
});

let images: any;
(async () => {
  images = await Loader.loadImages(
    path.join(__dirname, "..", "/public/assets")
  );
})();

const gameHandler = (io: Server, socket: Socket) => {
  handleStart(io, socket);
  handlePath(io, socket);
  handleBuildings(io, socket);
  handleUnits(io, socket);
  handleProduction(io, socket);
};

const onConnecton = async (socket: Socket) => {
  await utilsHandler(io, socket, images);
  connectionHandler(io, socket);
  gameHandler(io, socket);
};

io.on("connection", onConnecton);

httpServer.listen(PORT, () => {
  console.log(`Játék szerver elindult a ${PORT} porton.`);
});
