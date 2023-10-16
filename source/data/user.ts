import Database from "@src/clients/database";
import { User } from "@prisma/client";

const db = Database.instance;

type UserInput = {
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default {
  create: function (user: UserInput) {
    return db.user.create({ data: user });
  },
  getViaEmail: function (email: string) {
    return db.user.findUnique({ where: { email } });
  },
  getById: function (userId: number) {
    return db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  },
};
