import Database from "@src/clients/database";
import Chat from "@src/data/chat";
import Redis from "@src/clients/redis";

const db = Database.instance;
const redis = Redis.instance;

type MessageInput = {
  senderId: string;
  text: string;
  chatId: string;
};

export default {
  saveMessage: async function (message: MessageInput) {
    return db.message.create({ data: message });
  },
  getLastMessageByChatId: async function (chatId: string, userId: string) {
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
    const friendId = await Chat.getFriendIdFromChat(chatId, userId);
    const isFriendInChat = friendId
      ? (await redis.hget("chatRooms", `userId: ${friendId}`)) === chatId
      : false;
    const read = isFriendInChat;
    await db.message.update({
      where: {
        id: lastMessage.id,
      },
      data: {
        read: read,
      },
    });
    return {
      senderId: lastMessage.senderId,
      text: lastMessage.text,
      chatId: lastMessage.chatId,
      read: read,
      createdAt: lastMessage.createdAt,
      updatedAt: lastMessage.updatedAt,
    };
  },
};
