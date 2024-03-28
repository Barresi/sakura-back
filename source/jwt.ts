import "dotenv/config";
import jwt, { JwtPayload } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

    return payload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;

    return payload;
  } catch (error) {
    return null;
  }
};
