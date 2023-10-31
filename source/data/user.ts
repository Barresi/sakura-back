import { RequestStatus } from "@prisma/client";
import Database from "@src/clients/database";
import friendData from "@src/data/friend";

const db = Database.instance;

type UserInput = {
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default {
  createUser: async (user: UserInput) => {
    return db.user.create({ data: user });
  },
  getUserByEmail: async (email: string) => {
    return db.user.findUnique({ where: { email } });
  },
  getUserById: async (userId: number) => {
    return db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
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
};
