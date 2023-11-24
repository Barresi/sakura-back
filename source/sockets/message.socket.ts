import { Server, Socket } from "socket.io";
import Message from "@src/data/message";
import { handleNtfMessageEvents } from "./ntfMessage.socket";

export const handleMessageEvents = (io: Server, socket: Socket) => {
  const SEND_MESSAGE_EVENT = "sendMessage";
  const GET_MESSAGE_EVENT = "getMessage";

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

      handleNtfMessageEvents(io, userId, chatId, lastMessage);
    }
  });
};
