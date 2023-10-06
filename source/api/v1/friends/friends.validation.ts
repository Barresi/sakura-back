import { z } from "zod";
import { Request, Response } from "express";

export function request(req: Request, res: Response) {
  const schema = z.object({
    targetId: z.number().positive(),
  });

  try {
    return schema.parse(req.body);
  } catch (error: unknown) {
    res.status(404).json({ message: "Invalid user ID" });
  }
}
