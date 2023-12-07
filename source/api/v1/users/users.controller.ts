import { Request, Response } from "express";
import User from "@src/data/user";
import Friend from "@src/data/friend";
import FriendRequest from "@src/data/friend-request";
import Notification from "@src/data/notification";

export default {
  getAllUsers: async (req: Request, res: Response) => {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  },
  sendFriendRequest: async (req: Request, res: Response) => {
    const userId = req.userId;
    const friendId = req.params.friendId;

    if (userId === friendId) {
      return res
        .status(400)
        .json({ msg: "Вы не можете отправить заявку в друзья самому себе" });
    }

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const friend = await User.getUserById(friendId);
    if (!friend) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const areFriends = await Friend.areFriends(userId, friendId);
    if (areFriends) {
      return res.status(400).json({ msg: "Вы уже друзья с этим пользователем" });
    }

    const existingRequest = await FriendRequest.findPendingRequest(userId, friendId);
    if (existingRequest) {
      return res
        .status(400)
        .json({ msg: "Вы уже отправили заявку в друзья этому пользователю" });
    }

    await FriendRequest.sendFriendRequest(userId, friendId);
    await Notification.sendFriendRequestNtf(userId, friendId, req.app.get("io"));
    res.status(200).json({
      msg: `Вы отправили заявку в друзья ${friend.firstName} ${friend.lastName}`,
    });
  },
};
