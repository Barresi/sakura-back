import { Request, Response, NextFunction } from "express";
import pinoHttp from "pino-http";
import Logger from "./clients/logger";
import { ZodError } from "zod";
import { verifyAccessToken } from "./jwt";

declare global {
  namespace Express {
    export interface Request {
      session: {
        userId: number;
      };
    }
  }
}

function session(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (accessToken) {
    const payload = verifyAccessToken(accessToken);

    if (payload && typeof payload.userId === "number") {
      req.session.userId = payload.userId;
    }
  }

  next();
}

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
  return [session, expressLogger];
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
