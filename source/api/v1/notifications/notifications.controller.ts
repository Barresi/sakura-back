import { Request, Response } from "express";
import Notification from "../../../data/notification";

export default {
  getNotifications: async (req: Request, res: Response) => {
    const userId = req.userId;
    const notifications = await Notification.getUserAllNotifications(userId);
    if (!notifications) {
      return res.status(404).json({ msg: "Уведомления не найдены" });
    }

    res.status(200).json({ notifications });
  },
  updateNotificationsStatus: async (req: Request, res: Response) => {
    const userId = req.userId;
    const { notificationIds } = req.body;

    const notifications = await Notification.getUnreadNotifications(userId);
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ msg: "Уведомления не найдены" });
    }

    const existingNotificationIds = notifications.map((notification) => notification.id);
    const validNotificationIds = notificationIds.filter((id: string) =>
      existingNotificationIds.includes(id)
    );

    if (validNotificationIds.length === 0) {
      return res.status(404).json({ msg: "Уведомления не найдены" });
    }

    const updatedNotifications = await Notification.markNotificationsAsRead(
      validNotificationIds
    );

    res.status(200).json({ updatedNotifications });
  },
};
