import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";
import { ServerHandler } from "@/server/serverHandler";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

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
      ServerHandler.sendMessageToSender(socket, "auth:response", {
        message: "A felhasználónév foglalt!",
        status: 400,
      });

      return;
    }

    if (!username || !password) {
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
          refreshToken: "",
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

  const login = async ({ username, password }: UserEntity) => {
    const user = await prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      ServerHandler.sendMessageToSender(socket, "auth:response", {
        message: "A felhasználó nem található!",
        status: 400,
      });

      return;
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      ServerHandler.sendMessageToSender(socket, "auth:response", {
        message: "Helytelen felhasználónév vagy jelszó!",
        status: 400,
      });

      return;
    }

    const accessToken = jwt.sign(
      { username: user.username },
      process.env.JWT_ACCESS_TOKEN_SECRET || "default_access_secret",
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.JWT_REFRESH_TOKEN_SECRET || "default_refresh_secret",
      { expiresIn: "1d" }
    );

    ServerHandler.sendMessageToSender(socket, "auth:response", {
      message: "OK",
      status: 200,
      accessToken,
      refreshToken,
    });
  };

  const refresh = async () => {};
  const logout = async () => {};

  socket.on("auth:register", register);
  socket.on("auth:login", login);
  socket.on("auth:refresh", refresh), socket.on("auth.logout", logout);
};
