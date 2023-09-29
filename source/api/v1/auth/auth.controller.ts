import { Request, Response } from "express";
import { genSalt, hash, compare } from "bcrypt";
import { signup as validateSignup } from "./auth.validation";
import User from "@src/data/user";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./jwt";
import { setRefreshToken, deleteRefreshToken, getRefreshToken } from "./auth.tokens";

export default {
  signup: async function signup(req: Request, res: Response) {

    const body = validateSignup(req, res);
    if (!body) {
      res.status(404).json({ message: "Invalid user data" });
      return;
    }

    const existingUser = await User.getViaEmail(body.email);
    if (existingUser) {
      res.status(409).json({ message: "Этот email уже зарегестрирован" });
      return;
    }

    const hashedPassword = await hash(body.password, await genSalt());
    const user = await User.create({ ...body, password: hashedPassword });

    res.json({ id: user.id });
  },

  login: async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await User.getViaEmail(email);
    if (!user) {
      return res.status(401).json({ msg: "Неверный email или пароль" });
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ msg: "Неверный email или пароль" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await setRefreshToken(user.id, refreshToken);

    const userWithoutPassword = { id: user.id, email: user.email };

    // res.cookie("accessToken", accessToken, { maxAge: 180000, httpOnly: true });
    // res.cookie("refreshToken", refreshToken, { maxAge: 86400000, httpOnly: true });

    res.json({ accessToken, refreshToken, userWithoutPassword });
  },

  token: async function token(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Refresh token не предоставлен" });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(403).json({ msg: "Неверный refresh token" });
    }

    const storedRefreshToken = await getRefreshToken(payload.userId);
    if (storedRefreshToken !== refreshToken) {
      return res.status(403).json({ msg: "Неверный refresh token" });
    }

    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);

    await setRefreshToken(payload.userId, newRefreshToken);
    await deleteRefreshToken(payload.userId, refreshToken);

    // res.cookie("accessToken", accessToken, { maxAge: 180000, httpOnly: true });
    // res.cookie("refreshToken", refreshToken, { maxAge: 86400000, httpOnly: true });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  },

  logout: async function logout(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Refresh token не предоставлен" });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(403).json({ msg: "Неверный refresh token" });
    }

    await deleteRefreshToken(payload.userId, refreshToken);

    // res.clearCookie("accessToken");
    // res.clearCookie("refreshToken");

    res.sendStatus(204);
  },

  protectedUser: async function protectedUser(req: Request, res: Response) {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ msg: "Access token не предоставлен" });
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload || typeof payload.userId !== "number") {
      return res.status(403).json({
        msg: "Access token устарел. Пожалуйста, обновите токен или авторизуйтесь заново",
      });
    }

    const user = await User.getById(payload.userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    res.json({ user });
  },
};
