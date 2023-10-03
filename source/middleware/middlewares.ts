import { Request, Response } from 'express';
import pinoHttp from 'pino-http';
import { ZodError } from 'zod';

import Logger from '../clients/logger';

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

function errorHandler(err: Error, req: Request, res: Response) {
  req.log.error(err);

  if (err instanceof ZodError) {
    res.status(404).json({ message: 'Некорректные данные' });
  }

  res.status(500).json({ message: 'Internal server error' });
}

export function postMiddlewares() {
  return [errorHandler];
}
