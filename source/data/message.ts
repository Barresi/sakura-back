import Database from "@src/clients/database";
import { Message, Prisma } from "@prisma/client";

const db = Database.instance;

type MessageInput = {
  senderId: number;
  text: string;
  chatId: string;
};

export default {
  saveMessage: async function (message: MessageInput) {
    try {
      const newMessage = await db.message.create({
        data: message,
      });
      return newMessage;
    } catch (error) {
      throw new Error("Error saving message: " + (error as Error).message);
    }
  },
  getMessagesByChatId: async function (chatId: string): Promise<MessageInput[]> {
    try {
      const messages = await db.message.findMany({
        where: { chatId },
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      });
      return messages;
    } catch (error) {
      throw new Error("Error fetching messages: " + (error as Error).message);
    }
  },
};
