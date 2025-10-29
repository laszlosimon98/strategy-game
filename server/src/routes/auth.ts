import {
  handleLogin,
  handleRefreshToken,
  handleRegister,
} from "@/controller/authController";
import express from "express";

export const authRoutes = express.Router();

authRoutes.post("/register", handleRegister);
authRoutes.post("/login", handleLogin);
authRoutes.post("/refresh", handleRefreshToken);
