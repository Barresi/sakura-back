import { Request, Response } from "express";
import Notification from "@src/data/notification";

export default {
  getNotifications: async function (req: Request, res: Response) {
    const userId = req.userId;
    const notifications = await Notification.getUserNotifications(userId);
    if (!notifications) {
      return res.status(404).json({ msg: "Уведомления не найдены" });
    }

    res.status(200).json({ notifications });
  },
};
