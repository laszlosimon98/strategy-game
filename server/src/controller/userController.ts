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
};

export const getTopTenStatistic = async (
  request: Request,
  response: Response
) => {
  return await prismaService.user.findMany({
    take: 10,
    include: {
      statistic: true,
    },
  });
};

export const updateStatistic = async (request: Request, response: Response) => {
  console.log(request["user"]);
  console.log(request.body);
};
