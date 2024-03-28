import Database from "../clients/database";
import { Message } from "@prisma/client";

const db = Database.instance;

export default {
  getFriendIdFromChat: async function (
    chatId: string,
    userId: string
  ): Promise<string | null> {
    const chat = await db.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!chat) {
      return null;
    }
    const participants = chat.participants.map((participant) => participant.id);
    const friendId = participants.find((participantId) => participantId !== userId);
    return friendId || null;
  },
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
          createdById: userId,
        },
      });
      return newChat.id;
    }
  },
  getUserChats: async function (userId: string) {
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
            read: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const userChatsWithUnread = userChats.map((chat) => {
      const unreadCount = chat.messages.filter(
        (message) => !message.read && message.senderId !== userId
      ).length;

      return {
        chatId: chat.id,
        participants: chat.participants,
        newMessage: chat.messages[0],
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        unread: unreadCount,
        createdBy: chat.createdById,
      };
    });

    return userChatsWithUnread;
  },
  getChatHistoryByChatId: async function (
    chatId: string,
    userId: string
  ): Promise<Partial<Message>[]> {
    const chat = await db.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if (!chat) {
      return [];
    }
    const messages = chat.messages.map((message) => ({
      senderId: message.senderId,
      text: message.text,
      chatId: message.chatId,
      read: message.read,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }));
    const friendId = await this.getFriendIdFromChat(chatId, userId);
    if (friendId) {
      await db.message.updateMany({
        where: {
          chatId,
          senderId: friendId,
        },
        data: {
          read: true,
        },
      });
    }
    return messages;
  },
};
