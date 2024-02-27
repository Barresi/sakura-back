import { z } from "zod";
import { Request, Response } from "express";

export const usernameRegex = /^@[a-zA-Z0-9_-]+$/;
export const nameRegex = /^[а-яА-Яa-zA-Z]+$/u;
export const emailRegex = /^(?=.{1,256}$)[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const passwordRegex = /^[a-zA-Z!@#-_=+$%()/.,`^&*\d]+$/;

export function validateSignup(req: Request, res: Response) {
  const schema = z.object({
    username: z.string().trim().regex(usernameRegex).min(5).max(20).optional(),
    firstName: z.string().trim().regex(nameRegex).min(2).max(20),
    lastName: z.string().trim().regex(nameRegex).min(2).max(20),
    email: z.string().trim().regex(emailRegex),
    password: z.string().trim().regex(passwordRegex).min(8).max(20),
  });

  try {
    return schema.parse(req.body);
  } catch (error: unknown) {
    res.status(400).json({ msg: "Неверно заполнена форма регистрации" });
  }
}
