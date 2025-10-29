import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

export const verifyJWT = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers["authorization"];

  if (!authHeader) {
    return response.sendStatus(404);
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.JWT_ACCESS_TOKEN_SECRET || "default_access_secret",
    (err, decoded) => {
      if (err || !decoded) {
        return response.sendStatus(403);
      }

      if (typeof decoded === "object" && "username" in decoded) {
        request["user"] = decoded.username;
        next();
      } else {
        return response.sendStatus(403);
      }
    }
  );
};
