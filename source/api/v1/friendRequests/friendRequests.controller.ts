import { Request, Response } from "express";
import User from "@src/data/user";
import FriendRequest from "@src/data/friend-request";
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
    const requestId = parseInt(req.params.requestId, 10);

    if (isNaN(requestId) || requestId <= 0) {
      return res.status(400).json({ msg: "Неверный формат request ID" });
    }

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Пользователь не найден" });
    }

    const request = await FriendRequest.findRequestById(requestId, userId);
    if (!request) {
      return res.status(404).json({ msg: "Заявка в друзья не найдена" });
    }

    if (request.status === RequestStatus.ACCEPTED) {
      return res.status(400).json({ msg: "Заявка уже была принята" });
    }

    if (request.fromId === userId) {
      return res.status(400).json({ msg: "Невозможно принять свою заявку" });
    }

    await FriendRequest.acceptRequest(userId, requestId);

    return res.status(200).json({ msg: "Заявка в друзья успешно принята" });
  },
  rejectRequest: async (req: Request, res: Response) => {
    const userId = req.userId;
    const requestId = parseInt(req.params.requestId, 10);

    if (isNaN(requestId) || requestId <= 0) {
      return res.status(400).json({ msg: "Неверный формат request ID" });
    }

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

    await FriendRequest.rejectRequest(userId, requestId);

    return res.status(200).json({ msg: "Заявка в друзья успешно отклонена" });
  },
  cancelRequest: async (req: Request, res: Response) => {
    const userId = req.userId;
    const requestId = parseInt(req.params.requestId, 10);

    if (isNaN(requestId) || requestId <= 0) {
      return res.status(400).json({ msg: "Неверный формат request ID" });
    }

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

    return res.status(200).json({ msg: "Заявка в друзья успешно отменена" });
  },
};
