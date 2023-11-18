import { Server, Socket } from "socket.io";
import Redis from "@src/clients/redis";
import Chat from "@src/data/chat";
import Message from "@src/data/message";

const redis = Redis.instance;

export const setupChatEvent = (io: Server) => {
  const JOIN_CHAT_EVENT = "joinChat";
  const LEAVE_CHAT_EVENT = "leaveChat";
  const SEND_MESSAGE_EVENT = "sendMessage";
  const GET_MESSAGES_EVENT = "getMessages";

  io.on("connection", async (socket: Socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
      console.error("Invalid data received");
      return;
    }

    await redis.hset(
      "userSockets",
      `userId: ${userId}`,
      `socketId: ${socket.id}`,
      `connected: ${userId}`,
      "true"
    );

    console.log(`User with userId: ${userId} socketId: ${socket.id} connected`);

    socket.on(JOIN_CHAT_EVENT, async (chatId) => {
      socket.join(chatId);

      console.log(
        `User with userId: ${userId} socketId: ${socket.id} joined the chat ${chatId.chatId}`
      );

      // await redis.hset("chatRooms", String(chatId), JSON.stringify([userId, friendId]));

      // история чата, если есть
      const messages = await Chat.getChatByChatId(String(chatId.chatId));
      console.log(chatId);

      console.log("messages: ", messages);

      if (messages) {
        io.to(chatId).emit(GET_MESSAGES_EVENT, messages);
      }

      socket.on(GET_MESSAGES_EVENT, async () => {
        const messages = await Chat.getChatByChatId(String(chatId.chatId));

        if (messages) {
          socket.emit(GET_MESSAGES_EVENT, messages);
        }
      });
    });

    // socket.on(LEAVE_CHAT_EVENT, async (chatId) => {
    //   socket.leave(chatId.toString());

    //   await redis.hdel(
    //     "userSockets",
    //     `userId: ${userId}`,
    //     `socketId: ${socket.id}`,
    //     `connected: ${userId}`,
    //     "false"
    //   );

    //   console.log(
    //     `User with userId: ${userId} socketId: ${socket.id} left the chat ${chatId.chatId}`
    //   );
    // });

    socket.on(SEND_MESSAGE_EVENT, async (payload) => {
      const { userId, message, chatId } = payload;
      console.log("Payload: ", payload);
      try {
        await Message.saveMessage({
          senderId: userId,
          text: message,
          chatId: chatId.toString(),
        });

        const updatedMessages = await Chat.getChatByChatId(chatId);
        if (updatedMessages) {
          io.to(chatId).emit(GET_MESSAGES_EVENT, updatedMessages);
        }
      } catch (error) {
        console.error("Error saving or fetching messages:", error);
      }
    });

    socket.on("disconnect", async (chatId) => {
      socket.leave(chatId.toString());

      await redis.hdel(
        "userSockets",
        `userId: ${userId}`,
        `socketId: ${socket.id}`,
        `connected: ${userId}`,
        "false"
      );
      console.log(`User with userId: ${userId} socketId: ${socket.id} disconnected`);
    });
  });
};
