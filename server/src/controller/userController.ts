import { prismaService } from "@/prisma/prisma";
import { Response, Request } from "express";

export const handleUser = async (request: Request, response: Response) => {
  const username = request["user"];

  const user = await prismaService.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return response.sendStatus(403);
  }

  return response.status(200).json({ username: user.username });
};

export const getStatistic = async (request: Request, response: Response) => {
  const username = request["user"];

  const user = await prismaService.user.findUnique({
    omit: {
      password: true,
      refreshToken: true,
    },
    where: {
      username,
    },
    include: {
      statistic: true,
    },
  });

  if (!user) {
    return response.sendStatus(403);
  }

  return response.status(200).json(user);
};

export const getTopFiveStatistic = async (
  request: Request,
  response: Response
) => {
  const users = await prismaService.user.findMany({
    include: {
      statistic: true,
    },
    omit: {
      password: true,
      refreshToken: true,
    },
    orderBy: {
      statistic: {
        wins: "desc",
      },
    },
    take: 5,
  });

  return response.status(200).json(users);
};

export const updateStatistic = async (request: Request, response: Response) => {
  console.log(request["user"]);
  console.log(request.body);
};
