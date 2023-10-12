import { Request, Response, NextFunction } from "express";
import pinoHttp from "pino-http";
import Logger from "./clients/logger";
import { ZodError } from "zod";
import { verifyAccessToken, verifyRefreshToken } from "./api/v1/auth/jwt";

const logger = Logger.instance;
const expressLogger = pinoHttp({
  logger,
  serializers: {
    req: (req: Request) => ({
      method: req.method,
      url: req.url,
    }),
  },
});

export function preMiddlewares() {
  return [expressLogger];
}

// - - - - - - //

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  req.log.error(err);

  if (err instanceof ZodError) {
    res.status(404).json({ message: "Некорректные данные" });
  }

  res.status(500).json({ message: "Internal server error" });
}

export function postMiddlewares() {
  return [errorHandler];
}

// - - - - - - //

export interface CustomRequest extends Request {
  user?: {
    userId: number;
  };
}

export const authenticateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ msg: "Access token не предоставлен" });
  }

  const payload = verifyAccessToken(accessToken);
  if (!payload || typeof payload.userId !== "number") {
    return res.status(403).json({
      msg: "Access token устарел. Пожалуйста, обновите токен или авторизуйтесь заново",
    });
  }
  req.user = { userId: payload.userId };

  next();
};

export const authenticateRefreshToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ msg: "Refresh token не предоставлен" });
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.status(403).json({ msg: "Неверный refresh token" });
  }

  req.user = { userId: payload.userId };

  next();
};
