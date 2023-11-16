import Database from "@src/clients/database";
import { Chat } from "@prisma/client";

const db = Database.instance;

export default {
  createChatRoom: async function (userId: string, friendId: string) {
    const existingChat = await db.chat.findFirst({
      where: {
        participants: {
          every: {
            id: {
              in: [userId, friendId],
            },
          },
        },
      },
    });
    if (existingChat) {
      return existingChat.id;
    } else {
      const newChat = await db.chat.create({
        data: {
          participants: {
            connect: [{ id: userId }, { id: friendId }],
          },
        },
      });
      return newChat.id;
    }
  },
  getUserChats: async function (userId: string): Promise<Chat[]> {
    return db.chat.findMany({
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
  },
  findExistingChat: async function (
    userId: string,
    friendId: string
  ): Promise<Chat | null> {
    const existingChat = await db.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { id: userId } } },
          { participants: { some: { id: friendId } } },
        ],
      },
    });

    return existingChat;
  },
  getChatByChatId: async function (
    chatId: string
  ): Promise<{ id: string; message: string; chatId: string }[]> {
    const chat = await db.chat.findUnique({
      where: { id: chatId },
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
