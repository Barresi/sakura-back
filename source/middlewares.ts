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

  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ msg: "Превышено максимальное количество файлов" });
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ msg: "Превышен максимальный размер файла(ов)" });
    }
    return res.status(400).json({ msg: "Ошибка загрузки файла(ов)" });
  }

  if (err.message === "Invalid file type") {
    return res.status(400).json({ msg: "Неверный формат файла(ов)" });
  }

  if (err.message.startsWith("ENOENT")) {
    return res.status(400).json({ msg: "Ошибка записи файла(ов)" });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ msg: "Некорректные данные" });
  }

  res.status(500).json({ msg: "Внутренняя ошибка сервера" });
}

export function postMiddlewares() {
  return [errorHandler];
}
