import { Request, Response, NextFunction } from "express";
import pinoHttp from "pino-http";
import Logger from "./clients/logger";
import { ZodError } from "zod";

declare global {
  namespace Express {
    export interface Request {
      userId: string;
    }
  }
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
  return [expressLogger];
}

// - - - - - - //

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  req.log.error(err);

  if (err instanceof ZodError) {
    res.status(404).json({ msg: "Некорректные данные" });
  }

  res.status(500).json({ msg: "Внутренняя ошибка сервера" });
}

export function postMiddlewares() {
  return [errorHandler];
}
