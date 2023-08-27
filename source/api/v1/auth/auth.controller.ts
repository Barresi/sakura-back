import "dotenv/config";
import { Request, Response } from "express";
import { genSalt, hash, compare } from "bcrypt";
import User from "@src/data/user";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./jwt";
import { setRefreshToken, deleteRefreshToken, getRefreshToken } from "./redis";

export default {
  signup: async function signup(req: Request, res: Response) {
    const { email, password } = req.body;

    // https://stackoverflow.com/questions/60282362/regex-pattern-for-email
    /*
    const emailRegex =
      /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
    if (!emailRegex.test(email)) throw new Error("Некорректный email");
    */

    const existingUser = await User.getViaEmail(email);
    if (existingUser) throw new Error("Пользователь с этим email уже существует");

    //if (!passwordRegex.test(password)) throw new Error("Пароль слишком слабый");

    const hashedPassword = await hash(password, await genSalt());
    const user = await User.create(email, hashedPassword);

    res.json({ id: user.id });
  },

  login: async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await User.getViaEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await setRefreshToken(user.id, refreshToken);

    const userWithoutPassword = { id: user.id, email: user.email };

    res.json({ accessToken, refreshToken, userWithoutPassword });
  },

  token: async function token(req: Request, res: Response) {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(401);
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.sendStatus(403);
    }

    const storedRefreshToken = await getRefreshToken(payload.userId);
    if (storedRefreshToken !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(payload.userId);

    res.json({ accessToken: newAccessToken });
  },

  logout: async function logout(req: Request, res: Response) {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(400);
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.sendStatus(401);
    }

    await deleteRefreshToken(payload.userId);

    res.sendStatus(204);
  },

  protectedUser: async function protectedUser(req: Request, res: Response) {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      return res.sendStatus(401);
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload || typeof payload.userId !== "number") {
      return res.sendStatus(403);
    }

    const user = await User.getById(payload.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  },
};
