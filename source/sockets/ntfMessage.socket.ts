import { Server } from "socket.io";
import Chat from "@src/data/chat";
import Redis from "@src/clients/redis";
import { Message } from "@prisma/client";

const redis = Redis.instance;

export const handleNtfMessageEvents = async (
  io: Server,
  userId: string,
  chatId: string,
  lastMessage: Partial<Message>
) => {
  const NTF_GET_MESSAGE_EVENT = "ntfGetMessage";

  const friendId = await Chat.getFriendIdFromChat(chatId, userId);
  const friendSocketId = await redis.hget("userSockets", `userId: ${friendId}`);
  const userChatId = await redis.hget("chatRooms", `userId: ${userId}`);
  const friendChatId = await redis.hget("chatRooms", `userId: ${friendId}`);

  if (friendSocketId && (friendChatId === null || friendChatId !== userChatId)) {
    io.to(friendSocketId).emit(NTF_GET_MESSAGE_EVENT, lastMessage);
  }
};
