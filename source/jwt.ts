import jwt, { JwtPayload } from "jsonwebtoken";
import config from "config";

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, String(config.get("auth.accessTokenSecret")), {
    expiresIn: "5m",
  });
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, String(config.get("auth.refreshTokenSecret")), {
    expiresIn: "30d",
  });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    const payload = jwt.verify(
      token,
      String(config.get("auth.accessTokenSecret"))
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
      String(config.get("auth.refreshTokenSecret"))
    ) as JwtPayload;

    return payload;
  } catch (error) {
    return null;
  }
};
