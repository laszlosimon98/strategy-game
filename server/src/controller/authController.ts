import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Response, Request } from "express";
import * as jwt from "jsonwebtoken";

export const handleRegister = async (request: Request, response: Response) => {
  const { username, password } = request.body;

  const prismaService = new PrismaClient();

  const user = await prismaService.user.findUnique({
    where: {
      username,
    },
  });

  if (user) {
    response.status(400).send("A felhasználónév foglalt!");

    return;
  }

  if (!username || !password) {
    response.status(400).send("Az adatok megadása kötelező!");

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
    response.status(200).send("Sikeres regisztráció!");

    return;
  } catch (err) {
    console.log(err);
  }
};
