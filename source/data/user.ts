import Database from "@src/clients/database";

const db = Database.instance;

export default {
  create: function (email: string, hashedPassword: string) {
    return db.user.create({ data: { email, password: hashedPassword } });
  },
  getViaEmail: function (email: string) {
    return db.user.findUnique({ where: { email } });
  },
};
