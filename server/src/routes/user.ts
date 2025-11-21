import {
  getStatistic,
  getTopFiveStatistic,
  handleUser,
} from "@/controller/userController";
import express from "express";

export const userRoutes = express.Router();

userRoutes.get("/getUser", handleUser);
userRoutes.get("/statistic", getStatistic);
userRoutes.get("/top-five", getTopFiveStatistic);
