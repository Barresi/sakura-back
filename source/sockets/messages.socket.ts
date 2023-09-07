import { Socket } from "socket.io";
import { channel } from "@src/socket";

type Message = {
  text: string;
  destination: string;
};

channel.on("connection", (socket: Socket) => {
  socket.on("send-message", (message: Message) => {
    channel.to(message.destination).emit("receive-message", message.text);
  });
});
