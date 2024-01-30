import { Request, Response } from "express";
import { genSalt, hash, compare } from "bcryptjs";
import { passwordRegex, signup as validateSignup } from "./auth.validation";
import User, { SecurityInput } from "../../../data/user";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../jwt";
import { setRefreshToken, deleteRefreshToken, getRefreshToken } from "./auth.tokens";
import { Gender } from "@prisma/client";
import { z } from "zod";

export default {
  signup: async (req: Request, res: Response) => {
    const body = validateSignup(req, res);
    if (!body) {
      return res.status(400).json({ msg: "Неверно заполнена форма регистрации" });
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
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      city: user.city,
      birthDate: user.birthDate,
      gender: user.gender,
      description: user.description,
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

    res.status(200).json({ user });
  },
  updateAccount: async (req: Request, res: Response) => {
    const userId = req.userId;
    const account = req.body;

    if (
      !account.username &&
      !account.firstName &&
      !account.lastName &&
      !account.city &&
      !account.birthDate &&
      !account.gender &&
      !account.description
    ) {
      return res.status(400).json({
        msg: "Некоторые данные для обновления профиля должны быть предоставлены",
      });
    }

    if (
      account.firstName === "" ||
      account.firstName === null ||
      account.lastName === "" ||
      account.lastName === null
    ) {
      return res.status(400).json({ msg: "Имя и Фамилия не могут быть пустыми" });
    }

    if (account.gender && !Object.values(Gender).includes(account.gender)) {
      return res.status(400).json({
        msg: "Некорректное значение пола",
      });
    }

    if (account.username) {
      const existingUsername = await User.checkUsername(account.username);
      if (existingUsername) {
        return res.status(409).json({ msg: "Этот username уже занят" });
      }
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
    const securityInput: SecurityInput = req.body;

    if (!securityInput.email && !securityInput.password) {
      return res
        .status(400)
        .json({ msg: "Email и/или пароль должны быть предоставлены" });
    }

    try {
      const { email, password } = securityInput;

      const validatedSecurityInput = {
        email: email !== undefined ? z.string().email().trim().parse(email) : undefined,
        password:
          password !== undefined
            ? z.string().regex(passwordRegex).trim().parse(password)
            : undefined,
      };

      if (validatedSecurityInput.email) {
        const existingUser = await User.getUserByEmail(validatedSecurityInput.email);
        if (existingUser) {
          return res.status(409).json({ msg: "Этот email уже зарегистрирован" });
        }
      }

      if (validatedSecurityInput.password) {
        validatedSecurityInput.password = await hash(
          validatedSecurityInput.password,
          await genSalt()
        );
      }

      const updatedUser = await User.updateSecurity(userId, validatedSecurityInput);

      res.status(200).json({ email: updatedUser.email });
    } catch (error: unknown) {
      res.status(400).json({ msg: "Неверно заполнена форма" });
    }
  },
  deleteAccount: async (req: Request, res: Response) => {
    const userId = req.userId;

    await User.deleteUser(userId);

    res.status(200).json({ msg: "Профиль успешно удален" });
  },
};
