import { verifyAccessToken } from "../../jwt";
import { Request, Response, NextFunction } from "express";
import User from "../../data/user";
import Logger from "../../clients/logger";

const logger = Logger.instance;

export default async function (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  logger.info(`------Received token: ${authHeader}------`);

  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ msg: "Access token не предоставлен" });
  }

  const payload = verifyAccessToken(accessToken);
  if (!payload || typeof payload.userId !== "string") {
    return res.status(403).json({
      msg: "Access token устарел",
    });
  }

  const user = await User.getUserById(payload.userId);
  if (!user) {
    return res.status(404).json({ msg: "Пользователь не найден" });
  }

  req.userId = payload.userId;

  next();
}
