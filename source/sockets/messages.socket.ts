import { Server, Socket } from "socket.io";
import Redis from "@src/clients/redis";
import Chat from "@src/data/chat";
import Message from "@src/data/message";
import wrapSocket from "./socket-wrapper";
import Logger from "@src/clients/logger";

const redis = Redis.instance;
const logger = Logger.instance;

export const setupChatEvent = (io: Server) => {
  const CONNECTION = "connection";
  const JOIN_CHAT_EVENT = "joinChat";
  const GET_HISTORY_EVENT = "getHistory";
  const SEND_MESSAGE_EVENT = "sendMessage";
  const GET_MESSAGE_EVENT = "getMessage";
  const NTF_GET_MESSAGE_EVENT = "ntfGetMessage";
  const LEAVE_CHAT_EVENT = "leaveChat";
  const DISCONNECT = "disconnect";

  io.on(
    CONNECTION,
    wrapSocket(async (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;
      if (!userId) {
        logger.error("Invalid userId received");
        return;
      }

      await redis.hset("userSockets", `userId: ${userId}`, socket.id);
      logger.info(`User with userId: ${userId} socketId: ${socket.id} connected`);

      socket.on(JOIN_CHAT_EVENT, async (chatId) => {
        socket.join(chatId);
        await redis.hset("chatRooms", `userId: ${userId}`, chatId);
        logger.info(
          `User with userId: ${userId} socketId: ${socket.id} joined the chat ${chatId}`
        );

        const history = await Chat.getChatHistoryByChatId(chatId);
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

      socket.on(SEND_MESSAGE_EVENT, async (payload) => {
        const { userId, message, chatId } = payload;
        await Message.saveMessage({
          senderId: userId,
          text: message,
          chatId: chatId,
        });

        const lastMessage = await Message.getLastMessageByChatId(chatId);
        if (lastMessage) {
          io.to(chatId).emit(GET_MESSAGE_EVENT, lastMessage);

          const friendId = await Chat.getFriendIdFromChat(chatId, userId);
          const friendSocketId = await redis.hget("userSockets", `userId: ${friendId}`);
          const friendChatId = await redis.hget("chatRooms", `userId: ${friendId}`);
          if (friendSocketId && friendChatId === null) {
            io.to(friendSocketId).emit(NTF_GET_MESSAGE_EVENT, lastMessage);
          }
        }
      });

      socket.on(DISCONNECT, async () => {
        await redis.hdel("userSockets", `userId: ${userId}`, socket.id);
        logger.info(`User with userId: ${userId} socketId: ${socket.id} disconnected`);
      });
    })
  );
};
