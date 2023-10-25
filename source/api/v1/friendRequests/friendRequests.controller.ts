import { Request, Response } from "express";
import User from "@src/data/user";
import FriendRequest from "@src/data/friend-request";
import { RequestStatus } from "@prisma/client";

export default {
  getAllReceivedRequests: async (req: Request, res: Response) => {
    const userId = req.userId;

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const requests = await FriendRequest.getAllReceivedRequests(userId);

    return res.status(200).json(requests);
  },
  getAllSentRequests: async (req: Request, res: Response) => {
    const userId = req.userId;

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const requests = await FriendRequest.getAllSentRequests(userId);

    return res.status(200).json(requests);
  },
  acceptRequest: async (req: Request, res: Response) => {
    const userId = req.userId;
    const requestId = parseInt(req.params.requestId, 10);

    if (isNaN(requestId) || requestId <= 0) {
      return res.status(400).json({ msg: "Invalid request ID" });
    }

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const request = await FriendRequest.findRequestById(requestId, userId);
    if (!request) {
      return res.status(404).json({ msg: "Friend request not found." });
    }

    if (request.status !== RequestStatus.PENDING) {
      return res.status(400).json({ msg: "Friend request is not in PENDING state." });
    }

    if (request.fromId === userId) {
      return res.status(400).json({ msg: "You can't accept your own requests." });
    }

    await FriendRequest.acceptRequest(userId, requestId);

    return res.status(200).json({ msg: "Friend request accepted successfully." });
  },
  rejectRequest: async (req: Request, res: Response) => {
    const userId = req.userId;
    const requestId = parseInt(req.params.requestId, 10);

    if (isNaN(requestId) || requestId <= 0) {
      return res.status(400).json({ msg: "Invalid request ID" });
    }

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const request = await FriendRequest.findRequestById(requestId, userId);
    if (!request) {
      return res.status(404).json({ msg: "Friend request not found." });
    }

    if (request.toId !== userId) {
      return res
        .status(403)
        .json({ msg: "Unauthorized: You can only reject your own requests." });
    }

    if (request.status !== RequestStatus.PENDING) {
      return res.status(400).json({ msg: "Friend request is not in PENDING state." });
    }

    await FriendRequest.rejectRequest(userId, requestId);

    return res.status(200).json({ msg: "Friend request rejected successfully." });
  },
  cancelRequest: async (req: Request, res: Response) => {
    const userId = req.userId;
    const requestId = parseInt(req.params.requestId, 10);

    if (isNaN(requestId) || requestId <= 0) {
      return res.status(400).json({ msg: "Invalid request ID" });
    }

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const request = await FriendRequest.findRequestById(requestId, userId);
    if (!request) {
      return res.status(404).json({ msg: "Friend request not found." });
    }

    if (request.fromId !== userId) {
      return res
        .status(403)
        .json({ msg: "Unauthorized: You can only cancel your own requests." });
    }

    if (request.status !== RequestStatus.PENDING) {
      return res.status(400).json({ msg: "Friend request is not in PENDING state." });
    }

    await FriendRequest.cancelRequest(userId, requestId);

    return res.status(200).json({ msg: "Friend request canceled successfully." });
  },
};
