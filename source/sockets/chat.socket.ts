import { Server, Socket } from "socket.io";
import Chat from "@src/data/chat";
import Redis from "@src/clients/redis";
import Logger from "@src/clients/logger";

const redis = Redis.instance;
const logger = Logger.instance;

export const handleChatEvents = (io: Server, socket: Socket, userId: string) => {
  const JOIN_CHAT_EVENT = "joinChat";
  const GET_HISTORY_EVENT = "getHistory";
  const LEAVE_CHAT_EVENT = "leaveChat";

  socket.on(JOIN_CHAT_EVENT, async (chatId: string) => {
    socket.join(chatId);
    await redis.hset("chatRooms", `userId: ${userId}`, chatId);
    logger.info(
      `User with userId: ${userId} socketId: ${socket.id} joined the chat ${chatId}`
    );

    const history = await Chat.getChatHistoryByChatId(chatId, userId);
    if (history) {
      io.to(chatId).emit(GET_HISTORY_EVENT, history);
    }
  });

  socket.on(LEAVE_CHAT_EVENT, async (chatId) => {
    socket.leave(chatId);
    await redis.hdel("chatRooms", `userId: ${userId}`, chatId);
    logger.info(
      `User with userId: ${userId} socketId: ${socket.id} left the chat ${chatId}`
    );
  });
};
