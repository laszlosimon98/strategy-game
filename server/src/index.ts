import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import { Loader } from "@/utils/imageLoader";
import { handleUtils } from "@/handlers/handleUtils";
import { handleBuildings } from "@/handlers/handleBuildings";
import { handlePath } from "@/handlers/handlePath";
import { handleStart } from "@/handlers/handleStart";
import { handleUnits } from "@/handlers/handleUnits";
import { handleConnection } from "@/handlers/handleConnection";
import { handleProduction } from "@/handlers/handleProduction";
import { handleChat } from "@/handlers/handleChat";
import { authRoutes } from "routes/auth";
import { allowedOrigins } from "@/config/allowedOrigins";
import { corsOptions } from "@/config/corsOptions";
import { credentials } from "@/middleware/credentials";

const PORT = 3000;
const app = express();
const httpServer = createServer(app);

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "/public")));

app.use("/auth", authRoutes);

const io: Server = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
  },
});

const loadImages = async () => {
  return await Loader.loadImages(path.join(__dirname, "..", "/public/assets"));
};

const onConnecton = async (socket: Socket) => {
  handleUtils(io, socket, await loadImages());
  handleConnection(io, socket);
  handleStart(io, socket);
  handlePath(io, socket);
  handleBuildings(io, socket);
  handleUnits(io, socket);
  handleProduction(io, socket);
  handleChat(io, socket);
};

io.on("connection", onConnecton);

httpServer.listen(PORT, () => {
  console.log(`Játék szerver elindult a ${PORT} porton.`);
});
