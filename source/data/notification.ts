import Database from "../clients/database";
import { Server } from "socket.io";
import Redis from "../clients/redis";

const db = Database.instance;
const redis = Redis.instance;

export const NTF_USER_SEND_FRIEND_EVENT = "ntfSendFriend";
export const NTF_USER_ACCEPT_FRIEND_EVENT = "ntfAcceptFriend";
export const NTF_USER_REJECT_FRIEND_EVENT = "ntfRejectFriend";

export default {
  getUserAllNotifications: async (userId: string) => {
    return db.notification.findMany({
      where: {
        recipients: {
          some: {
            id: userId,
          },
        },
      },
    });
  },
  getUnreadNotifications: async (userId: string) => {
    return db.notification.findMany({
      where: {
        read: false,
        recipients: {
          some: {
            id: userId,
          },
        },
      },
    });
  },
  markNotificationsAsRead: async (notificationIds: string[]) => {
    const updatedNotifications = await db.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return updatedNotifications;
  },
  sendFriendRequestNtf: async (userId: string, friendId: string, io: Server) => {
    const content = `${userId} подал заявку в друзья`;
    const notification = {
      type: "sendFriendRequest",
      content,
      read: false,
      recipients: { connect: [{ id: friendId }] },
    };

    const createdNotification = await db.notification.create({ data: notification });

    const friendSocketId = await redis.hget("userSockets", `userId: ${friendId}`);
    if (friendSocketId) {
      io.to(friendSocketId).emit(NTF_USER_SEND_FRIEND_EVENT, {
        friendId: userId,
        notificationId: createdNotification.id,
      });
    }

    return createdNotification;
  },
  sendAcceptRequestNtf: async (userId: string, friendId: string, io: Server) => {
    const content = `${userId} принял заявку в друзья`;
    const notification = {
      type: "acceptFriendRequest",
      content,
      read: false,
      recipients: { connect: [{ id: friendId }] },
    };

    const createdNotification = await db.notification.create({ data: notification });

    const friendSocketId = await redis.hget("userSockets", `userId: ${friendId}`);
    if (friendSocketId) {
      io.to(friendSocketId).emit(NTF_USER_ACCEPT_FRIEND_EVENT, {
        friendId: userId,
        notificationId: createdNotification.id,
      });
    }

    return createdNotification;
  },
  sendRejectRequestNtf: async (userId: string, friendId: string, io: Server) => {
    const content = `${userId} отклонил заявку в друзья`;
    const notification = {
      type: "rejectFriendRequest",
      content,
      read: false,
      recipients: { connect: [{ id: friendId }] },
    };

    const createdNotification = await db.notification.create({ data: notification });

    const friendSocketId = await redis.hget("userSockets", `userId: ${friendId}`);
    if (friendSocketId) {
      io.to(friendSocketId).emit(NTF_USER_REJECT_FRIEND_EVENT, {
        friendId: userId,
        notificationId: createdNotification.id,
      });
    }

    return createdNotification;
  },
};
