import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import config from "../../../config/default";

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, String(config.auth.accessTokenSecret), {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, String(config.auth.refreshTokenSecret), {
    expiresIn: "1d",
  });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    const payload = jwt.verify(
      token,
      String(config.auth.accessTokenSecret)
    ) as JwtPayload;
    return payload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    const payload = jwt.verify(
      token,
      String(config.auth.refreshTokenSecret)
    ) as JwtPayload;
    return payload;
  } catch (error) {
    return null;
  }
};
