import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import { authHandler } from "./handlers/authHandler";
import { connectionHandler } from "./handlers/connectionHandler";
import { gameHandler } from "./handlers/gameHandler/gameHandler";
import path from "path";
import { imageHandler, imageHandler2 } from "./handlers/imageHandler";
import { Loader } from "./classes/imageLoader";

const PORT = 3000;

const app = express();
const httpServer = createServer(app);

app.use(express.static(path.join(__dirname, "..", "/public")));

const io: Server = new Server(httpServer, {
  cors: {
    // origin: "*",
    origin: [
      "http://localhost:5173",
      "http://192.168.1.70:5173",
      "http://localhost:5174",
    ],
  },
});

let images: any;
(async () => {
  images = await Loader.loadImages(
    path.join(__dirname, "..", "/public/assets")
  );
})();

const onConnecton = (socket: Socket) => {
  connectionHandler(io, socket);
  imageHandler(io, socket);
  imageHandler2(io, socket, images);
  gameHandler(io, socket);
  // authHandler();
};

io.on("connection", onConnecton);

httpServer.listen(PORT, () => {
  console.log(`Game server is listening on port ${PORT}`);
});
