import Database from "@src/clients/database";
import { Chat, Message, Prisma, User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

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
      const newChatId = uuidv4();
      const newChat = await db.chat.create({
        data: {
          chatId: newChatId,
          participants: {
            connect: [{ id: userId }, { id: friendId }],
          },
        },
      });
      return newChat;
    }
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
