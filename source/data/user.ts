import { Gender } from "@prisma/client";
import Database from "../clients/database";

const db = Database.instance;

type UserInput = {
  username?: string;
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

export type SecurityInput = {
  email?: string;
  password?: string;
};

export default {
  createUser: async (user: UserInput) => {
    return db.user.create({ data: user });
  },
  getUserByEmail: async (email: string) => {
    return db.user.findUnique({ where: { email } });
  },
  getUserById: async (userId: string) => {
    return db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        city: true,
        birthDate: true,
        gender: true,
        description: true,
      },
    });
  },
  getAllUsers: async () => {
    return db.user.findMany({
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
      where: { id: userId },
      data: {
        ...account,
        birthDate: account.birthDate ? new Date(account.birthDate) : null,
      },
    });
  },
  updateSecurity: async (userId: string, securityInput: SecurityInput) => {
    return db.user.update({
      where: { id: userId },
      data: {
        ...securityInput,
      },
    });
  },
};
