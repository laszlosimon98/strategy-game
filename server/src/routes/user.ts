import { handleUser } from "@/controller/userController";
import express from "express";

export const userRoutes = express.Router();

userRoutes.get("/getUser", handleUser);
