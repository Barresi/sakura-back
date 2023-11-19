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
};
