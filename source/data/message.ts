import Database from "@src/clients/database";
import { Message, Prisma } from "@prisma/client";

const db = Database.instance;

type MessageInput = {
  senderId: string;
  text: string;
  chatId: string;
};

export default {
  saveMessage: async function (message: MessageInput) {
    return db.message.create({ data: message });
  },
  getMessagesByChatId: async function (chatId: string): Promise<MessageInput[]> {
    return db.message.findMany({
      where: { chatId },
      include: { sender: true },
      orderBy: { createdAt: "asc" },
    });
  },
};
