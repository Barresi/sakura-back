import { Request, Response } from "express";
import User from "../../../data/user";
import FriendRequest from "../../../data/friend-request";
import Notification from "../../../data/notification";
import { RequestStatus } from "@prisma/client";

export default {
  getAllReceivedRequests: async (req: Request, res: Response) => {
    const userId = req.userId;

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const requests = await FriendRequest.getAllReceivedRequests(userId);

    return res.status(200).json(requests);
  },
  getAllSentRequests: async (req: Request, res: Response) => {
    const userId = req.userId;

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const requests = await FriendRequest.getAllSentRequests(userId);

    return res.status(200).json(requests);
  },
  acceptRequest: async (req: Request, res: Response) => {
    const userId = req.userId;
    const requestId = req.params.requestId;

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const request = await FriendRequest.findRequestById(requestId, userId);
    if (!request) {
      return res.status(404).json({ msg: "Заявка в друзья не найдена" });
    }

    if (request.status === RequestStatus.ACCEPTED) {
      return res.status(400).json({ msg: "Вы уже приняли эту заявку" });
    }

    if (request.fromId === userId) {
      return res.status(400).json({ msg: "Вы не можете принять свою заявку" });
    }

    await FriendRequest.acceptRequest(userId, requestId);

    const friendId = await FriendRequest.findFriendId(requestId, userId);
    if (!friendId) {
      return res.status(404).json({ msg: "Друг не найден" });
    }
    await Notification.sendAcceptRequestNtf(userId, friendId, req.app.get("io"));

    return res
      .status(200)
      .json({ msg: `Вы приняли заявку в друзья от ${user.firstName} ${user.lastName}` });
  },
  rejectRequest: async (req: Request, res: Response) => {
    const userId = req.userId;
    const requestId = req.params.requestId;

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const request = await FriendRequest.findRequestById(requestId, userId);
    if (!request) {
      return res.status(404).json({ msg: "Заявка в друзья не найдена" });
    }

    if (request.toId !== userId) {
      return res
        .status(403)
        .json({ msg: "Вы можете отклонить только входящие вам заявки" });
    }

    const friendId = await FriendRequest.findFriendId(requestId, userId);
    if (!friendId) {
      return res.status(404).json({ msg: "Друг не найден" });
    }
    await Notification.sendRejectRequestNtf(userId, friendId, req.app.get("io"));

    await FriendRequest.rejectRequest(userId, requestId);

    return res.status(200).json({
      msg: `Вы отклонили заявку в друзья от ${user.firstName} ${user.lastName}`,
    });
  },
  cancelRequest: async (req: Request, res: Response) => {
    const userId = req.userId;
    const requestId = req.params.requestId;

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const request = await FriendRequest.findRequestById(requestId, userId);
    if (!request) {
      return res.status(404).json({ msg: "Заявка в друзья не найдена" });
    }

    if (request.fromId !== userId) {
      return res
        .status(403)
        .json({ msg: "Вы можете отменить только исходящие от вас заявки" });
    }

    await FriendRequest.cancelRequest(userId, requestId);

    return res
      .status(200)
      .json({ msg: `Вы отменили заявку в друзья от ${user.firstName} ${user.lastName}` });
  },
};
