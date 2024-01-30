import { RequestStatus } from "@prisma/client";
import Database from "../clients/database";

const db = Database.instance;

export default {
  findFriendByRequestId: async (requestId: string, userId: string) => {
    const friendRequest = await db.friend.findUnique({
      where: {
        id: requestId,
        OR: [{ fromId: userId }, { toId: userId }],
      },
    });

    if (!friendRequest) {
      return null;
    }

    const friendId =
      friendRequest.fromId === userId ? friendRequest.toId : friendRequest.fromId;

    const friend = await db.user.findUnique({
      where: {
        id: friendId,
        deleted: null,
      },
    });

    return friend;
  },
  findRequestById: async (requestId: string, userId: string) => {
    return db.friend.findUnique({
      where: {
        id: requestId,
        OR: [{ fromId: userId }, { toId: userId }],
      },
    });
  },
  findPendingRequest: async (fromId: string, toId: string) => {
    return db.friend.findFirst({
      where: {
        status: RequestStatus.PENDING,
        OR: [
          { fromId: fromId, toId: toId },
          { fromId: toId, toId: fromId },
        ],
      },
    });
  },
  sendFriendRequest: async (userId: string, friendId: string) => {
    return db.friend.create({
      data: {
        fromId: userId,
        toId: friendId,
        status: RequestStatus.PENDING,
      },
    });
  },
  getAllReceivedRequests: async function (userId: string) {
    return db.friend.findMany({
      where: {
        toId: userId,
        status: RequestStatus.PENDING,
      },
    });
  },
  getAllSentRequests: async function (userId: string) {
    return db.friend.findMany({
      where: {
        fromId: userId,
        status: RequestStatus.PENDING,
      },
    });
  },
  acceptRequest: async function (userId: string, requestId: string) {
    const acceptedRequest = await db.friend.findFirst({
      where: {
        id: requestId,
        toId: userId,
        status: RequestStatus.PENDING,
      },
    });
    if (acceptedRequest) {
      await db.friend.update({
        where: { id: acceptedRequest.id, status: RequestStatus.PENDING },
        data: { status: RequestStatus.ACCEPTED },
      });
    }
  },
  rejectRequest: async function (userId: string, requestId: string) {
    const rejectedRequest = await db.friend.findFirst({
      where: {
        id: requestId,
        toId: userId,
        status: RequestStatus.PENDING,
      },
    });
    if (rejectedRequest) {
      await db.friend.delete({
        where: {
          id: rejectedRequest.id,
        },
      });
    }
  },
  cancelRequest: async function (userId: string, requestId: string) {
    const canceledRequest = await db.friend.findFirst({
      where: {
        id: requestId,
        fromId: userId,
        status: RequestStatus.PENDING,
      },
    });
    if (canceledRequest) {
      await db.friend.delete({
        where: {
          id: canceledRequest.id,
        },
      });
    }
  },
};
