import { Server, Socket } from "socket.io";
import Redis from "../clients/redis";
import wrapSocket from "./socket-wrapper";
import Logger from "../clients/logger";
import { handleChatEvents } from "./chat.socket";
import { handleMessageEvents } from "./message.socket";

const redis = Redis.instance;
const logger = Logger.instance;

export const setupSocketConnection = (io: Server) => {
  const CONNECTION = "connection";
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

      handleChatEvents(io, socket, userId);
      handleMessageEvents(io, socket);

      socket.on(DISCONNECT, async () => {
        await redis.hdel("userSockets", `userId: ${userId}`, socket.id);
        logger.info(`User with userId: ${userId} socketId: ${socket.id} disconnected`);
      });
    }, CONNECTION)
  );
};
