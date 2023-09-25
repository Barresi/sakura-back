import {
  Request as ExpressRequest,
  Response,
  NextFunction as ExpressNextFunction,
} from 'express';

export interface RequestWithUserId extends ExpressRequest {
  userId?: number;
}

export type CustomNextFunction = (
  error?: any, // To address the ESLint error, you can replace 'any' with a more specific type if available.
  req?: RequestWithUserId,
  res?: Response,
  next?: ExpressNextFunction
) => void;

export default function wrap<T>(
  fn: (req: RequestWithUserId, res: Response, next: CustomNextFunction) => Promise<T>
) {
  return (req: RequestWithUserId, res: Response, next: ExpressNextFunction) => {
    fn(req, res, next).catch(next);
  };
}
