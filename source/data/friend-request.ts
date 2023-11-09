import { RequestStatus } from "@prisma/client";
import Database from "@src/clients/database";

const db = Database.instance;

export default {
  findRequestById: async (requestId: number, userId: number) => {
    return await db.friend.findUnique({
      where: {
        id: requestId,
        OR: [{ fromId: userId }, { toId: userId }],
      },
    });
  },
  findPendingRequest: async (fromId: number, toId: number) => {
    return await db.friend.findFirst({
      where: {
        status: RequestStatus.PENDING,
        OR: [
          {
            fromId,
            toId,
          },
          {
            fromId: toId,
            toId: fromId,
          },
        ],
      },
    });
  },
  sendFriendRequest: async (userId: number, friendId: number) => {
    return db.friend.create({
      data: {
        fromId: userId,
        toId: friendId,
        status: RequestStatus.PENDING,
      },
    });
  },
  getAllReceivedRequests: async function (userId: number) {
    return await db.friend.findMany({
      where: {
        toId: userId,
        status: RequestStatus.PENDING,
      },
    });
  },
  getAllSentRequests: async function (userId: number) {
    return await db.friend.findMany({
      where: {
        fromId: userId,
        status: RequestStatus.PENDING,
      },
    });
  },
  acceptRequest: async function (userId: number, requestId: number) {
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
  rejectRequest: async function (userId: number, requestId: number) {
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
  cancelRequest: async function (userId: number, requestId: number) {
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
