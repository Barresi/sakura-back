import { Request, Response } from "express";
import User from "@src/data/user";
import Friendship from "@src/data/friendship";

import { request as validateRequest } from "./friends.validation";

export default {
  request: async function (req: Request, res: Response) {
    const { targetId } = validateRequest(req, res)!;
    const { userId } = req.session;

    if (userId === targetId) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const targetUser = await User.getById(targetId);
    if (!targetUser) {
      res.status(404).json({ message: "Неизвестный пользователь" });
      return;
    }

    const existingFriendship = await Friendship.getPair(userId, targetId);
    if (existingFriendship) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    return Friendship.create(userId, targetId);
  },
};
