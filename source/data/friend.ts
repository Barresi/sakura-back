import { RequestStatus } from "@prisma/client";
import Database from "@src/clients/database";

const db = Database.instance;

export default {
  areFriends: async (userId: number, friendId: number) => {
    const friendRelationship = await db.friend.findFirst({
      where: {
        OR: [
          { fromId: userId, toId: friendId },
          { fromId: friendId, toId: userId },
        ],
        status: RequestStatus.ACCEPTED,
      },
    });
    return friendRelationship !== null;
  },
  getAllFriends: async (userId: number) => {
    return await db.friend.findMany({
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
  deleteFriend: async (userId: number, friendId: number) => {
    await db.friend.deleteMany({
      where: {
        OR: [
          { fromId: userId, toId: friendId },
          { fromId: friendId, toId: userId },
        ],
      },
    });
  },
};
