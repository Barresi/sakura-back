import { Gender } from "@prisma/client";
import Database from "../clients/database";

const db = Database.instance;

type UserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AccountInput = {
  username?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  birthDate?: Date;
  gender?: Gender;
  description?: string;
};

export default {
  createUser: async (user: UserInput) => {
    return db.user.create({ data: user });
  },
  getUserByEmail: async (email: string) => {
    return db.user.findUnique({ where: { email, deleted: null } });
  },
  emailAlreadyRegistered: async (email: string) => {
    return db.user.findUnique({ where: { email } });
  },
  checkEmail: async (email: string, userId: string) => {
    return db.user.findUnique({ where: { email, NOT: { id: userId } } });
  },
  checkUsername: async (username: string | undefined, userId: string) => {
    if (!username) {
      return null;
    }
    return db.user.findUnique({ where: { username, NOT: { id: userId } } });
  },
  getUserById: async (userId: string) => {
    return db.user.findUnique({ where: { id: userId, deleted: null } });
  },
  getAllUsers: async () => {
    return db.user.findMany({
      where: { deleted: null },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        friends: true,
        friended: true,
      },
    });
  },
  updateAccount: async (userId: string, account: AccountInput) => {
    return db.user.update({
      where: { id: userId, deleted: null },
      data: {
        ...account,
        birthDate: account.birthDate ? new Date(account.birthDate) : undefined,
      },
    });
  },
  updateSecurity: async (userId: string, email?: string, password?: string) => {
    return db.user.update({
      where: { id: userId, deleted: null },
      data: { email, password },
    });
  },
  deleteUser: async (userId: string) => {
    return db.user.update({
      where: { id: userId, deleted: null },
      data: { deleted: new Date() },
    });
  },
};
