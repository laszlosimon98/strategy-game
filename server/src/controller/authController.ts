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

  try {
    const user = await prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      return response.status(409).send("A felhasználónév foglalt!");
    }

    if (!username || !password) {
      return response.status(400).send("Az adatok megadása kötelező!");
    }

    const hashedPassword: string = await bcrypt.hash(
      password,
      parseInt(process.env.HASHROUND || "10")
    );

    const createdUser = await prismaService.user.create({
      data: {
        username,
        password: hashedPassword,
        refreshToken: "",
      },
    });

    await prismaService.statistic.create({
      data: {
        usersid: createdUser.id,
        losses: 0,
        wins: 0,
      },
    });

    return response.status(201).send("Sikeres regisztráció!");
  } catch (err) {
    return response.status(500).send("Sikertelen regisztráció!");
  }
};

export const handleLogin = async (request: Request, response: Response) => {
  const { username, password } = request.body;

  try {
    const user = await prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return response.status(404).send("A felhasználó nem található!");
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return response.status(401).send("Rossz felhasználónév vagy jelszó!");
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

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return response.status(200).json({ accessToken });
  } catch (e) {
    return response.status(400).send("A felhasználó nem található!");
  }
};

export const handleRefreshToken = async (
  request: Request,
  response: Response
) => {
  const cookies = request.cookies;

  if (!cookies?.refreshToken) {
    return response.sendStatus(401);
  }

  const refreshToken = cookies.refreshToken;

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

      response.status(200).json({ accessToken });
    }
  );
};

export const handleLogout = async (request: Request, response: Response) => {
  const cookies = request.cookies;

  if (!cookies?.refreshToken) {
    return response.sendStatus(204);
  }

  const refreshToken = cookies.refreshToken;

  const user = await prismaService.user.findFirst({
    where: {
      refreshToken,
    },
  });

  if (!user) {
    response.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return response.sendStatus(204);
  }

  try {
    await prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        refreshToken: "",
      },
    });

    response.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return response.sendStatus(204);
  } catch (err) {
    return response.json(err);
  }
};

export const handleCheck = async (request: Request, response: Response) => {
  const cookies = request.cookies;

  if (!cookies?.refreshToken) {
    return response.status(200).send({ success: false });
  }

  return response.status(200).send({ success: true });
};
