import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import { Loader } from "@/utils/imageLoader";
import { handleUtils } from "@/game/handlers/handleUtils";
import { handleBuildings } from "@/game/handlers/handleBuildings";
import { handleStart } from "@/game/handlers/handleStart";
import { handleUnits } from "@/game/handlers/handleUnits";
import { handleConnection } from "@/game/handlers/handleConnection";
import { handleProduction } from "@/game/handlers/handleProduction";
import { handleChat } from "@/game/handlers/handleChat";
import { authRoutes } from "@/routes/auth";
import { allowedOrigins } from "@/config/allowedOrigins";
import { corsOptions } from "@/config/corsOptions";
import { credentials } from "@/middleware/credentials";
import { verifyJWT } from "@/middleware/verifyJWT";
import { userRoutes } from "@/routes/user";

const app = express();
const httpServer = createServer(app);

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "/public")));

app.use("/auth", authRoutes);

app.use(verifyJWT);
app.use("/user", userRoutes);

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
  handleBuildings(io, socket);
  handleUnits(io, socket);
  handleProduction(io, socket);
  handleChat(io, socket);
};

io.on("connection", onConnecton);

httpServer.listen(process.env.PORT, () => {
  console.log(
    `Játék szerver elindult a http://${process.env.HOST}:${process.env.PORT} címen.`
  );
});
