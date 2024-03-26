import { Request, Response, NextFunction } from "express";
import pinoHttp from "pino-http";
import Logger from "./clients/logger";
import { ZodError } from "zod";
import { MulterError } from "multer";

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
    res: (res: Response) => ({
      statusCode: res.statusCode,
    }),
    err: (err: Error) => ({
      message: err.message,
      stack: err.stack,
    }),
  },
});

export function preMiddlewares() {
  return [expressLogger];
}

// - - - - - - //

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error(err);

  if (err.message === "Invalid file type") {
    return res.status(400).json({ msg: "Неверный формат файла" });
  }

  if (err instanceof MulterError) {
    return res.status(400).json({ msg: "Ошибка загрузки файла" });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ msg: "Некорректные данные" });
  }

  res.status(500).json({ msg: "Внутренняя ошибка сервера" });
}

export function postMiddlewares() {
  return [errorHandler];
}
