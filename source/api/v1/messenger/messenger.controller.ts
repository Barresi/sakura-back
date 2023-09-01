import "dotenv/config";
import { Server, Socket } from "socket.io";
import config from "../../../config/default";

let io: Server;

export const initMessengerSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: config.deploy.frontendUrl, // Your frontend's URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle incoming messages
    socket.on("send-message", (message: string) => {
      // You can implement logic here to handle the incoming message
      console.log(`Received message from ${socket.id}: ${message}`);

      // Broadcast the message to all connected clients (except sender)
      socket.broadcast.emit("new-message", message);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export const getSocketIoInstance = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized.");
  }
  return io;
};
