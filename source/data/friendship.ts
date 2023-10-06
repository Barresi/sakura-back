import Database from "@src/clients/database";

const db = Database.instance;

export default {
  getPair: function (fromId: number, toId: number) {
    return db.friendship.findUnique({ where: { fromId_toId: { fromId, toId } } });
  },

  create: function (fromId: number, toId: number) {
    return db.friendship.create({ data: { fromId, toId, status: "PENDING" } });
  },
};
