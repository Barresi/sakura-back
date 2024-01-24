import { z } from "zod";
import { Request, Response } from "express";

// https://stackoverflow.com/questions/2370015/regular-expression-for-password-validation
export const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

export function signup(req: Request, res: Response) {
  const schema = z.object({
    username: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email().trim(),
    password: z.string().regex(passwordRegex).trim(),
  });

  try {
    return schema.parse(req.body);
  } catch (error: unknown) {
    res.status(400).json({ msg: "Неверно заполнена форма регистрации" });
  }
}
