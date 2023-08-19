import { Request, Response } from "express";
import { genSalt, hash } from "bcrypt";
import User from "@src/data/user";

export default {
  signup: async function signup(req: Request, res: Response) {
    const { email, password } = req.body;

    // https://stackoverflow.com/questions/60282362/regex-pattern-for-email
    const emailRegex =
      /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
    if (!emailRegex.test(email)) throw new Error("Некорректный email");

    const existingUser = await User.getViaEmail(email);
    if (existingUser) throw new Error("Пользователь с этим email уже существует");

    // https://stackoverflow.com/questions/2370015/regular-expression-for-password-validation
    const passwordRegex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
    if (!passwordRegex.test(password)) throw new Error("Пароль слишком слабый");

    const hashedPassword = await hash(password, await genSalt());

    const user = await User.create(email, hashedPassword);

    res.json({ id: user.id });
  },
};
