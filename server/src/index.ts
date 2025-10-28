import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";

import { Loader } from "@/utils/imageLoader";
import { handleUtils } from "@/handlers/handleUtils";
import { handleBuildings } from "@/handlers/handleBuildings";
import { handlePath } from "@/handlers/handlePath";
import { handleStart } from "@/handlers/handleStart";
import { handleUnits } from "@/handlers/handleUnits";
import { handleConnection } from "@/handlers/handleConnection";
import { handleProduction } from "@/handlers/handleProduction";
import { handleChat } from "@/handlers/handleChat";
import { handleAuth } from "@/handlers/handleAuth";

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
  handleChat(io, socket);
};

const onConnecton = async (socket: Socket) => {
  await handleUtils(io, socket, images);
  handleConnection(io, socket);
  handleAuth(io, socket);
  gameHandler(io, socket);
};

io.on("connection", onConnecton);

httpServer.listen(PORT, () => {
  console.log(`Játék szerver elindult a ${PORT} porton.`);
});
