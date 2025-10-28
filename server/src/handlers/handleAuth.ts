import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";
import * as bcrypt from "bcrypt";
import { ServerHandler } from "@/server/serverHandler";

type UserEntity = {
  username: string;
  password: string;
};

type AccessToken = {
  accessToken: string;
};

export const handleAuth = (io: Server, socket: Socket) => {
  const prismaService = new PrismaClient();

  const register = async ({ username, password }: UserEntity) => {
    const user = await prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      console.log("user");
      ServerHandler.sendMessageToSender(socket, "auth:response", {
        message: "A felhasználónév foglalt!",
        status: 400,
      });

      return;
    }

    if (!username || !password) {
      console.log("username, password");
      ServerHandler.sendMessageToSender(socket, "auth:response", {
        message: "Az adatok megadása kötelező!",
        status: 400,
      });

      return;
    }

    const hashedPassword: string = await bcrypt.hash(
      password,
      parseInt(process.env.HASHROUND || "10")
    );

    try {
      await prismaService.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      ServerHandler.sendMessageToSender(socket, "auth:response", {
        message: "Sikeres regisztráció!",
        status: 200,
      });

      return;
    } catch (err) {
      console.log(err);
    }
  };

  const login = async () => {};
  const refresh = async () => {};
  const logout = async () => {};

  socket.on("auth:register", register);
  socket.on("auth:login", login);
  socket.on("auth:refresh", refresh), socket.on("auth.logout", logout);
};
