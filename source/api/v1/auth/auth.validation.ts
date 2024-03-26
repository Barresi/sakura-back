import { z } from "zod";

export const usernameRegex = /^@[a-zA-Z0-9_-]+$/;
export const nameRegex = /^[а-яА-ЯёЁa-zA-Z]+$/u;
export const emailRegex = /^(?=.{1,256}$)[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const passwordRegex = /^[a-zA-Z!@#-_=+$%()/.,`^&*\d]+$/;

export function validateSignup(body: any) {
  const schema = z.object({
    firstName: z.string().trim().regex(nameRegex).min(2).max(20),
    lastName: z.string().trim().regex(nameRegex).min(2).max(20),
    email: z.string().trim().regex(emailRegex),
    password: z.string().trim().regex(passwordRegex).min(8).max(20),
  });

  return schema.parse(body);
}

export function validateUsername(username: string) {
  const schema = z.object({
    username: z.string().trim().regex(usernameRegex).min(5).max(20),
  });

  return schema.parse({ username });
}

export function validateFirstName(firstName: string) {
  const schema = z.object({
    firstName: z.string().trim().regex(nameRegex).min(2).max(20),
  });

  return schema.parse({ firstName });
}

export function validateLastName(lastName: string) {
  const schema = z.object({
    lastName: z.string().trim().regex(nameRegex).min(2).max(20),
  });

  return schema.parse({ lastName });
}
