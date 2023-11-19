import { Server, Socket } from "socket.io";
import Redis from "@src/clients/redis";
import Chat from "@src/data/chat";
import Message from "@src/data/message";
import wrapSocket from "./socket-wrapper";
import Logger from "@src/clients/logger";

const redis = Redis.instance;
const logger = Logger.instance;

export const setupChatEvent = (io: Server) => {
  const JOIN_CHAT_EVENT = "joinChat";
  const LEAVE_CHAT_EVENT = "leaveChat";
  const SEND_MESSAGE_EVENT = "sendMessage";
  const GET_MESSAGES_EVENT = "getMessages";

  io.on(
    "connection",
    wrapSocket(async (socket: Socket) => {
      const userId = socket.handshake.query.userId;

      if (!userId) {
        logger.error("Invalid userId received");
        return;
      }

      await redis.hset(
        "userSockets",
        `userId: ${userId}`,
        `socketId: ${socket.id}`,
        `connected: ${userId}`,
        "true"
      );

      logger.info(`User with userId: ${userId} socketId: ${socket.id} connected`);

      socket.on(JOIN_CHAT_EVENT, async (chatId) => {
        socket.join(chatId);

        logger.info(
          `User with userId: ${userId} socketId: ${socket.id} joined the chat ${chatId}`
        );

        const messages = await Chat.getChatByChatId(chatId);

        if (messages) {
          io.to(chatId).emit(GET_MESSAGES_EVENT, messages);
        }

        socket.on(GET_MESSAGES_EVENT, async () => {
          const messages = await Chat.getChatByChatId(chatId);

          if (messages) {
            socket.emit(GET_MESSAGES_EVENT, messages);
          }
        });
      });

      socket.on(LEAVE_CHAT_EVENT, async (chatId) => {
        socket.leave(chatId);

        await redis.hdel(
          "userSockets",
          `userId: ${userId}`,
          `socketId: ${socket.id}`,
          `connected: ${userId}`,
          "false"
        );

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

        const updatedMessages = await Chat.getChatByChatId(chatId);
        if (updatedMessages) {
          io.to(chatId).emit(GET_MESSAGES_EVENT, updatedMessages);
        }
      });

      socket.on("disconnect", async () => {
        await redis.hdel(
          "userSockets",
          `userId: ${userId}`,
          `socketId: ${socket.id}`,
          `connected: ${userId}`,
          "false"
        );
        logger.info(`User with userId: ${userId} socketId: ${socket.id} disconnected`);
      });
    })
  );
};
