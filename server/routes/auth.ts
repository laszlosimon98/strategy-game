import { handleRegister } from "controller/authController";
import express from "express";

export const authRoutes = express.Router();

authRoutes.post("/register", handleRegister);
