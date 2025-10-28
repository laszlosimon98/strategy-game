import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";

export const handleAuth = (io: Server, socket: Socket) => {
  const prismaClient = new PrismaClient();

  const register = async () => {};
  const login = async () => {};
  const refresh = async () => {};
  const logout = async () => {};

  socket.on("auth:register", register);
  socket.on("auth:login", login);
  socket.on("auth:refresh", refresh), socket.on("auth.logout", logout);
};
