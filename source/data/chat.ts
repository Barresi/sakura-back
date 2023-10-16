import Database from "@src/clients/database";
import { Chat, Message, Prisma, User } from "@prisma/client";

const db = Database.instance;

type ChatInput = {
  chatId: string;
  participants: number[];
};

export default {
  createChatRoom: async function (chatId: string, userId: number, friendId: number) {
    const existingChat = await db.chat.findUnique({
      where: { chatId },
    });

    if (!existingChat) {
      const newChat = await db.chat.create({
        data: {
          chatId,
          participants: {
            connect: [{ id: userId }, { id: friendId }],
          },
        },
      });
      return newChat;
    }
    return existingChat;
  },
  getChatByChatId: async function (
    chatId: string
  ): Promise<{ id: number; message: string; chatId: string }[]> {
    try {
      const chat = await db.chat.findUnique({
        where: { chatId },
        include: {
          messages: {
            select: {
              senderId: true,
              text: true,
              chatId: true,
            },
          },
        },
      });

      if (!chat) {
        return [];
      }

      const messages = chat.messages.map((message) => ({
        id: message.senderId,
        message: message.text,
        chatId: message.chatId,
      }));

      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },
};
