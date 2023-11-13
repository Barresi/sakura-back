import Database from "@src/clients/database";
import { Chat, Message, Prisma, User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const db = Database.instance;

type ChatInput = {
  chatId: string;
  participants: number[];
};

export default {
  createChatRoom: async function (userId: number, friendId: number) {
    const chatId = uuidv4();
    const newChat = await db.chat.create({
      data: {
        chatId,
        participants: {
          connect: [{ id: userId }, { id: friendId }],
        },
      },
    });
    return newChat;
  },
  getUserChats: async function (userId: number): Promise<Chat[]> {
    const userChats = await db.chat.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
          },
        },
        messages: {
          select: {
            senderId: true,
            text: true,
            chatId: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    return userChats;
  },
  getChatByChatId: async function (
    chatId: string
  ): Promise<{ id: number; message: string; chatId: string }[]> {
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
  },
};
