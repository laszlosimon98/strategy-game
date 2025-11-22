import {
  getStatistic,
  getTopFiveStatistic,
} from "@/controller/statisticController";
import express from "express";

export const statisticRoutes = express.Router();

statisticRoutes.get("/statistic", getStatistic);
statisticRoutes.get("/top-five", getTopFiveStatistic);
