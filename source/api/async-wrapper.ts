import { Request, Response, NextFunction } from "express";

/**
 * Wrap Async Handler - so express will be able to catch an async error
 * @param fn - async express handler
 * @returns wrapped async express handler
 */
export default function wrap<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
