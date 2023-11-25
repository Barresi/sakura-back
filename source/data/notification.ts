import Database from "@src/clients/database";

const db = Database.instance;

export default {
  getUserNotifications: async (userId: string) => {
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
  sendFriendRequestNtf: async (userId: string, friendId: string) => {
    const content = `${userId} подал заявку в друзья`;
    const notification = {
      type: "sendFriendRequest",
      content,
      read: false,
      recipients: { connect: [{ id: friendId }] },
    };

    return db.notification.create({ data: notification });
  },
  sendAcceptRequestNtf: async (userId: string, friendId: string) => {
    const content = `${userId} принял заявку в друзья`;
    const notification = {
      type: "acceptFriendRequest",
      content,
      read: false,
      recipients: { connect: [{ id: friendId }] },
    };

    return db.notification.create({ data: notification });
  },
  sendRejectRequestNtf: async (userId: string, friendId: string) => {
    const content = `${userId} отклонил заявку в друзья`;
    const notification = {
      type: "rejectFriendRequest",
      content,
      read: false,
      recipients: { connect: [{ id: friendId }] },
    };

    return db.notification.create({ data: notification });
  },
};
