import { Request, Response } from "express";
import { genSalt, hash, compare } from "bcrypt";
import { signup as validateSignup } from "./auth.validation";
import User from "@src/data/user";
import { generateAccessToken, generateRefreshToken } from "./jwt";
import { setRefreshToken, deleteRefreshToken, getRefreshToken } from "./auth.tokens";
import { CustomRequest } from "@src/middlewares";

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

    res.json({ accessToken, refreshToken, userWithoutPassword });
  },

  token: async function token(req: CustomRequest, res: Response) {
    const { refreshToken } = req.body;

    if (!req.user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const storedRefreshToken = await getRefreshToken(req.user.userId);
    if (storedRefreshToken !== refreshToken) {
      return res.status(403).json({ msg: "Неверный refresh token" });
    }

    const newAccessToken = generateAccessToken(req.user.userId);
    const newRefreshToken = generateRefreshToken(req.user.userId);

    await setRefreshToken(req.user.userId, newRefreshToken);
    await deleteRefreshToken(req.user.userId, refreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  },

  logout: async function logout(req: CustomRequest, res: Response) {
    const { refreshToken } = req.body;

    if (!req.user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    await deleteRefreshToken(req.user.userId, refreshToken);

    res.sendStatus(204);
  },

  protectedUser: async function protectedUser(req: CustomRequest, res: Response) {
    if (!req.user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const user = await User.getById(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    res.json({ user });
  },
};
