import { Request, Response } from "express";
import { genSalt, hash, compare } from "bcryptjs";
import { signup as validateSignup } from "./auth.validation";
import { security as validateSecurity } from "./auth.validation";
import User from "../../../data/user";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../jwt";
import { setRefreshToken, deleteRefreshToken, getRefreshToken } from "./auth.tokens";

export default {
  signup: async (req: Request, res: Response) => {
    const body = validateSignup(req, res);
    if (!body) {
      res.status(400).json({ msg: "Неверно заполнена форма регистрации" });
      return;
    }

    const existingUser = await User.getUserByEmail(body.email);
    if (existingUser) {
      return res.status(409).json({ msg: "Этот email уже зарегистрирован" });
    }

    const hashedPassword = await hash(body.password, await genSalt());
    const user = await User.createUser({ ...body, password: hashedPassword });

    res.status(200).json({ id: user.id });
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.getUserByEmail(email);
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

    const userWithoutPassword = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    res.status(200).json({ accessToken, refreshToken, userWithoutPassword });
  },

  token: async (req: Request, res: Response) => {
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

    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  },

  logout: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Refresh token не предоставлен" });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(403).json({ msg: "Неверный refresh token" });
    }

    await deleteRefreshToken(payload.userId, refreshToken);
    res.status(200).json({ msg: "Вы успешно вышли из своего аккаунта" });
  },

  userInfo: async (req: Request, res: Response) => {
    const userId = req.userId;
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    res.status(200).json({ user });
  },
  updateAccount: async (req: Request, res: Response) => {
    const userId = req.userId;
    const account = req.body;

    if (!account.firstName || !account.lastName) {
      return res.status(400).json({ msg: "Имя и Фамилия не могут быть пустыми" });
    }

    const updatedAccount = await User.updateAccount(userId, account);

    const updatedFields = {
      username: updatedAccount.username,
      firstName: updatedAccount.firstName,
      lastName: updatedAccount.lastName,
      city: updatedAccount.city,
      birthDate: updatedAccount.birthDate,
      gender: updatedAccount.gender,
      description: updatedAccount.description,
    };

    res.status(200).json({ updatedFields });
  },
  updateSecurity: async (req: Request, res: Response) => {
    const userId = req.userId;
    const body = validateSecurity(req, res);
    if (!body) {
      res.status(400).json({ msg: "Неверно заполнена форма" });
      return;
    }

    if (!body.email || !body.password) {
      return res.status(400).json({ msg: "Email и пароль не могут быть пустыми" });
    }

    const existingUser = await User.getUserByEmail(body.email);
    if (existingUser && existingUser.id !== userId) {
      return res.status(409).json({ msg: "Этот email уже зарегистрирован" });
    }

    const hashedPassword = await hash(body.password, await genSalt());
    const updatedSecurity = await User.updateSecurity(userId, body.email, hashedPassword);

    res.status(200).json({ msg: "Данные успешно обновлены" });
  },
};
