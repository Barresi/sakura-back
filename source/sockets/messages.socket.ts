import { Server, Socket } from "socket.io";
import Redis from "@src/clients/redis";
// import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    // const chatId = uuidv4();
    // const chatId = "sss";
    await redis.hset("chatRooms", String(chatId), JSON.stringify([userId, friendId]));

    await redis.hset(
      "userSockets",
      `userId: ${userId}`,
      `socketId: ${socket.id}`,
      `connected: ${userId}`,
      "true"
    );

    console.log(`User with userId: ${userId} socketId: ${socket.id} connected`);

    socket.join(chatId);
    socket.emit("chatRoomCreated", chatId);
    console.log(
      `User with userId: ${userId} socketId: ${socket.id} joined the chat ${chatId}`
    );

    socket.on("disconnect", async () => {
      socket.leave(String(chatId));

      await redis.hdel(
        "userSockets",
        `userId: ${userId}`,
        `socketId: ${socket.id}`,
        `connected: ${userId}`,
        "false"
      );

      console.log(`User with userId: ${userId} socketId: ${socket.id} disconnected`);
    });

    socket.on("chat", async (payload) => {
      const { id, message, chatId, socketId } = payload;

      console.log("Payload: ", payload);

      try {
        let chat = await prisma.chat.findUnique({
          where: { chatId },
        });

        if (!chat) {
          chat = await prisma.chat.create({
            data: {
              chatId,
            },
          });
        }

        await prisma.message.create({
          data: {
            sender: { connect: { id } },
            text: message,
            chat: { connect: { chatId } },
          },
        });

        io.to(chatId).emit("chat", payload);
      } catch (error) {
        console.error("Error saving message to the database:", error);
      }
    });
  });
};
