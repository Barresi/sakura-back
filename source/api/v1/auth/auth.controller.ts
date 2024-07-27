import { Request, Response } from "express";
import { genSalt, hash, compare } from "bcryptjs";
import {
  validateSignup,
  validateUsername,
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateCity,
  validateDescription,
} from "./auth.validation";
import User from "../../../data/user";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../jwt";
import { setRefreshToken, deleteRefreshToken, getRefreshToken } from "./auth.tokens";
import { NextFunction } from "express-serve-static-core";
import { avatarFolderPath, bannerFolderPath, deleteOldFileUtility } from "./auth.upload";
import path from "path";

function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default {
  signup: async (req: Request, res: Response) => {
    const body = req.body;

    if (body) {
      validateSignup(body);
    }

    const existingUser = await User.emailAlreadyRegistered(body.email);
    if (existingUser) {
      return res.status(409).json({ msg: "Этот email уже зарегистрирован" });
    }

    const hashedPassword = await hash(body.password, await genSalt());
    const user = await User.createUser({
      ...body,
      firstName: capitalizeFirstLetter(body.firstName),
      lastName: capitalizeFirstLetter(body.lastName),
      password: hashedPassword,
    });

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
      avatar: user.avatar,
      banner: user.banner,
      city: user.city,
      birthDate: user.birthDate,
      gender: user.gender,
      description: user.description,
      posts: user.posts,
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
    const userInfo = await User.getUserById(userId);
    if (!userInfo) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const user = {
      id: userInfo.id,
      username: userInfo.username,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      avatar: userInfo.avatar,
      banner: userInfo.banner,
      city: userInfo.city,
      birthDate: userInfo.birthDate,
      gender: userInfo.gender,
      description: userInfo.description,
      posts: userInfo.posts,
    };

    res.status(200).json({ user });
  },
  updateAccount: async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const account = req.body;

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    if (account.username) {
      validateUsername(account.username);
      const existingUsername = await User.checkUsername(account.username, userId);
      if (existingUsername) {
        return res.status(409).json({ msg: "Этот username уже занят" });
      }
    }

    if (account.firstName) {
      validateFirstName(account.firstName);
    }

    if (account.lastName) {
      validateLastName(account.lastName);
    }

    if (account.city) {
      validateCity(account.city);
    }

    if (account.description) {
      validateDescription(account.description);
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files) {
      if (files.avatar) {
        const newAvatarFile = files.avatar[0].filename;
        if (user.avatar) {
          deleteOldFileUtility(`${avatarFolderPath}/${userId}/${user.avatar}`);
        }
        account.avatar = newAvatarFile;
      }

      if (files.banner) {
        const newBannerFile = files.banner[0].filename;
        if (user.banner) {
          deleteOldFileUtility(`${bannerFolderPath}/${userId}/${user.banner}`);
        }
        account.banner = newBannerFile;
      }
    }

    const updatedAccount = await User.updateAccount(userId, {
      ...account,
      firstName: account.firstName ? capitalizeFirstLetter(account.firstName) : undefined,
      lastName: account.lastName ? capitalizeFirstLetter(account.lastName) : undefined,
    });

    const updatedFields = {
      username: updatedAccount.username ?? user.username,
      firstName: updatedAccount.firstName ?? user.firstName,
      lastName: updatedAccount.lastName ?? user.lastName,
      city: updatedAccount.city ?? user.city,
      birthDate: updatedAccount.birthDate ?? user.birthDate,
      gender: updatedAccount.gender ?? user.gender,
      description: updatedAccount.description ?? user.description,
      avatar: account.avatar ?? user.avatar,
      banner: account.banner ?? user.banner,
    };

    res.status(200).json({ updatedFields });
  },
  updateSecurity: async (req: Request, res: Response) => {
    const userId = req.userId;
    const { email, password, confirmPassword } = req.body;

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const passwordMatch = await compare(confirmPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ msg: "Неверный пароль подтверждения" });
    }

    if (email) {
      validateEmail(email);
      const emailAlreadyRegistered = await User.checkEmail(email, userId);
      if (emailAlreadyRegistered) {
        return res.status(409).json({ msg: "Этот email уже зарегистрирован" });
      }
    }

    let hashedPassword;
    if (password) {
      validatePassword(password);
      try {
        hashedPassword = await hash(password, await genSalt());
      } catch (error) {
        return res.status(500).json({ msg: "Ошибка при хешировании пароля" });
      }
    }

    const updatedUser = await User.updateSecurity(userId, email, hashedPassword);

    res.status(200).json({ email: updatedUser.email });
  },
  deleteAccount: async (req: Request, res: Response) => {
    const userId = req.userId;
    const { confirmPassword } = req.body;
    if (!confirmPassword) {
      return res.status(400).json({ msg: "Пароль подтверждения не предоставлен" });
    }

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const passwordMatch = await compare(confirmPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ msg: "Неверный пароль подтверждения" });
    }

    const storedRefreshToken = await getRefreshToken(userId);
    if (storedRefreshToken) {
      await deleteRefreshToken(userId, storedRefreshToken);
    }

    if (user.avatar) {
      deleteOldFileUtility(path.join(avatarFolderPath, userId, user.avatar));
    }
    if (user.banner) {
      deleteOldFileUtility(path.join(bannerFolderPath, userId, user.banner));
    }

    await User.deleteUser(userId);

    res.status(200).json({ msg: "Профиль успешно удален" });
  },
};
