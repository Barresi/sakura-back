import { Request, Response } from "express";
import User from "@src/data/user";
import Friend from "@src/data/friend";

export default {
  getAllFriends: async (req: Request, res: Response) => {
    const userId = req.userId;

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const friends = await Friend.getAllFriends(userId);

    return res.status(200).json(friends);
  },
  deleteFriend: async (req: Request, res: Response) => {
    const userId = req.userId;
    const friendId = parseInt(req.params.friendId, 10);

    if (isNaN(friendId) || friendId <= 0) {
      return res.status(400).json({ msg: "Неверный формат friend ID" });
    }

    if (userId === friendId) {
      return res.status(400).json({ msg: "Невозможно удалить себя из друзей" });
    }

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const friendExists = await User.getUserById(friendId);
    if (!friendExists) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const areFriends = await Friend.areFriends(userId, friendId);

    if (!areFriends) {
      return res.status(403).json({ msg: "Пользователи не являются друзьями" });
    }

    await Friend.deleteFriend(userId, friendId);
    res.json({ msg: "Друг успешно удален" });
    res.status(204);
  },
};
