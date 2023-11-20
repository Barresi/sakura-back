import { Message } from "@prisma/client";
import Database from "@src/clients/database";

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
  getLastMessageByChatId: async function (
    chatId: string
  ): Promise<Partial<Message> | null> {
    const lastMessage = await db.message.findFirst({
      where: {
        chatId: chatId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastMessage) {
      return null;
    }

    return {
      senderId: lastMessage.senderId,
      text: lastMessage.text,
      chatId: lastMessage.chatId,
      createdAt: lastMessage.createdAt,
      updatedAt: lastMessage.updatedAt,
    };
  },
};
