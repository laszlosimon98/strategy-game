import {
  getStatistic,
  getTopTenStatistic,
  handleUser,
  updateStatistic,
} from "@/controller/userController";
import express from "express";

export const userRoutes = express.Router();

userRoutes.get("/getUser", handleUser);
userRoutes.get("/statistic", getStatistic);
userRoutes.get("/topten", getTopTenStatistic);
userRoutes.patch("/update-statistic", updateStatistic);
