import { prismaService } from "@/prisma/prisma";
import * as bcrypt from "bcrypt";
import { Response, Request } from "express";
import * as jwt from "jsonwebtoken";

interface DecodedToken {
  username: string;
  iat: number;
  exp: number;
}

export const handleRegister = async (request: Request, response: Response) => {
  const { username, password } = request.body;

  const user = await prismaService.user.findUnique({
    where: {
      username,
    },
  });

  if (user) {
    return response.status(400).send("A felhasználónév foglalt!");
  }

  if (!username || !password) {
    return response.status(400).send("Az adatok megadása kötelező!");
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

    return response.status(200).send("Sikeres regisztráció!");
  } catch (err) {
    return response.status(500).send("Váratlan hiba történt!");
  }
};

export const handleLogin = async (request: Request, response: Response) => {
  const { username, password } = request.body;

  const user = await prismaService.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return response.status(400).send("A felhasználó nem található!");
  }

  const isPasswordValid: boolean = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    return response.status(400).send("Rossz felhasználónév vagy jelszó!");
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

  await prismaService.user.update({
    where: { username },
    data: {
      refreshToken,
    },
  });

  response.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return response.status(200).json({ accessToken });
};

export const handleRefreshToken = async (
  request: Request,
  response: Response
) => {
  const cookies = request.cookies;

  if (!cookies?.jwt) {
    return response.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  const user = await prismaService.user.findFirst({
    where: {
      refreshToken,
    },
  });

  if (!user) {
    return response.sendStatus(403);
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET || "default_refresh_secret",
    (
      err: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err || user.username !== (decoded as DecodedToken).username) {
        return response.sendStatus(403);
      }

      const accessToken: string = jwt.sign(
        { username: user.username },
        process.env.JWT_ACCESS_TOKEN_SECRET || "default_access_secret",
        { expiresIn: "5m" }
      );

      response.json({ accessToken });
    }
  );
};
