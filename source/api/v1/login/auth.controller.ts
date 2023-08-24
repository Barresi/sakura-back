import "dotenv/config";
import { Request, Response } from "express";
import { compare } from "bcrypt";
import User from "@src/data/user";
import jwt from "jsonwebtoken";
import config from "config";

export default {
  login: async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await User.getViaEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email }, String(config.get("auth.secret")), {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  },
};
