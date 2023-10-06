import { Request, Response } from "express";
import { genSalt, hash, compare } from "bcrypt";
import { signup as validateSignup } from "./auth.validation";
import User from "@src/data/user";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@src/jwt";
import { setRefreshToken, deleteRefreshToken, getRefreshToken } from "./auth.tokens";

export default {
  signup: async function signup(req: Request, res: Response) {
    const body = validateSignup(req, res);
    if (!body) {
      res.status(404).json({ message: "Invalid user data" });
      return;
    }

    const existingUser = await User.getByEmail(body.email);
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

    const user = await User.getByEmail(email);
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

    // res.cookie("accessToken", accessToken, { maxAge: 180000, httpOnly: true });
    // res.cookie("refreshToken", refreshToken, { maxAge: 86400000, httpOnly: true });

    res.json({ accessToken, refreshToken, userWithoutPassword });
  },

  token: async function token(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const storedRefreshToken = await getRefreshToken(payload.userId);
    if (storedRefreshToken !== refreshToken) {
      return res.status(403).json({ error: "Invalid refresh token" });
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
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    await deleteRefreshToken(payload.userId, refreshToken);

    // res.clearCookie("accessToken");
    // res.clearCookie("refreshToken");

    res.sendStatus(204);
  },

  me: async function (req: Request, res: Response) {
    const { userId } = req.session;

    if (userId) {
      const user = await User.getById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user });
    }

    res.status(401).json({ message: "Unauthorized" });
  },
};
