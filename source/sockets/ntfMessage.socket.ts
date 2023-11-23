import { Server, Socket } from "socket.io";
import Chat from "@src/data/chat";
import Redis from "@src/clients/redis";
import { Message } from "@prisma/client";

const redis = Redis.instance;

export const handleNtfMessageEvents = async (
  io: Server,
  socket: Socket,
  chatId: string,
  lastMessage: Partial<Message>
) => {
  const NTF_GET_MESSAGE_EVENT = "ntfGetMessage";

  const userId = socket.handshake.query.userId as string;

  const friendId = await Chat.getFriendIdFromChat(chatId, userId);
  const friendSocketId = await redis.hget("userSockets", `userId: ${friendId}`);
  const friendChatId = await redis.hget("chatRooms", `userId: ${friendId}`);
  if (friendSocketId && friendChatId === null) {
    io.to(friendSocketId).emit(NTF_GET_MESSAGE_EVENT, lastMessage);
  }
};
