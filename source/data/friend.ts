import { RequestStatus } from "@prisma/client";
import Database from "../clients/database";

const db = Database.instance;

export default {
  areFriends: async (userId: string, friendId: string) => {
    return db.friend.findFirst({
      where: {
        OR: [
          { fromId: userId, toId: friendId },
          { fromId: friendId, toId: userId },
        ],
        status: RequestStatus.ACCEPTED,
      },
    });
  },
  getAllFriends: async (userId: string) => {
    return db.friend.findMany({
      where: {
        OR: [
          {
            fromId: userId,
            status: RequestStatus.ACCEPTED,
          },
          {
            toId: userId,
            status: RequestStatus.ACCEPTED,
          },
        ],
      },
    });
  },
  deleteFriend: async (userId: string, friendId: string) => {
    return db.friend.deleteMany({
      where: {
        OR: [
          { fromId: userId, toId: friendId },
          { fromId: friendId, toId: userId },
        ],
      },
    });
  },
};
