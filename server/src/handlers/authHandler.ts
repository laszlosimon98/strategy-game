import { PrismaClient } from "@prisma/client";

export const authHandler = () => {
  const prismaClient = new PrismaClient();

  const login = async () => {
    const count = await prismaClient.user.count();
    console.log(count);
  };

  login();
};

authHandler();
