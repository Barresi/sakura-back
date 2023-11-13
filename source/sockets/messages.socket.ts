import { Server, Socket } from "socket.io";
import Redis from "@src/clients/redis";
import Chat from "@src/data/chat";
import Message from "@src/data/message";

const redis = Redis.instance;

export const setupChatEvent = (io: Server) => {
  io.on("connection", async (socket: Socket) => {
    const userId = socket.handshake.query.userId;
    const friendId = socket.handshake.query.friendId;
    const chatId = socket.handshake.query.chatId;

    if (!userId || !friendId || !chatId) {
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

    // присоединение к чат комнате
    socket.join(chatId);
    socket.emit("chatRoom", chatId);

    await redis.hset("chatRooms", String(chatId), JSON.stringify([userId, friendId]));
    console.log(
      `User with userId: ${userId} socketId: ${socket.id} joined the chat ${chatId}`
    );
    // история чата, если существует
    const messages = await Chat.getChatByChatId(String(chatId));
    if (messages) {
      socket.emit("chatMessages", messages);
    }

    socket.on("chatMessages", async (payload) => {
      const { id, message, chatId } = payload;
      console.log("Payload: ", payload);
      try {
        await Message.saveMessage({
          senderId: id,
          text: message,
          chatId: chatId.toString(),
        });

        const updatedMessages = await Chat.getChatByChatId(chatId);
        if (updatedMessages) {
          io.to(chatId).emit("chatMessages", updatedMessages);
        }
      } catch (error) {
        console.error("Error saving or fetching messages:", error);
      }
    });

    socket.on("disconnect", async () => {
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
