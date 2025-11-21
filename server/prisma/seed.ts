import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();
const HASHROUND = parseInt(process.env.HASHROUND || "6");

const seedUsers = async () => {
  const password = "Password123";
  const hashedPassword = await bcrypt.hash(password, HASHROUND);

  const users = [
    { username: "Bela", password: hashedPassword },
    { username: "Eszter", password: hashedPassword },
    { username: "Mate", password: hashedPassword },
    { username: "Anna", password: hashedPassword },
    { username: "Peter", password: hashedPassword },
    { username: "Katalin", password: hashedPassword },
    { username: "Gabor", password: hashedPassword },
    { username: "Judit", password: hashedPassword },
    { username: "Attila", password: hashedPassword },
    { username: "Reka", password: hashedPassword },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: {
        username: user.username,
        password: user.password,
        refreshToken: "",
      },
    });
  }
};

const seedStatistic = async () => {
  const users = await prisma.user.findMany();

  for (const user of users) {
    const wins = Math.floor(Math.random() * 50);
    const losses = Math.floor(Math.random() * 50);

    await prisma.statistic.upsert({
      where: { usersid: user.id },
      update: {
        wins,
        losses,
      },
      create: {
        usersid: user.id,
        wins,
        losses,
      },
    });
  }
};

const main = async () => {
  console.log("Felhasználók feltöltése...");
  await seedUsers();

  console.log("Statisztikák feltöltése...");
  await seedStatistic();

  console.log("Seed sikeresen befejezve!");
};

main()
  .catch((error) => {
    console.error("Hiba történt a feltöltés során:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
