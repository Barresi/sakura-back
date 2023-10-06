import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  const { userId } = req.session;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  next();
}
