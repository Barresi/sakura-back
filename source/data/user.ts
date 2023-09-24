import Database from '@src/clients/database';
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
  async getById(userId: number) {
    try {
      return await db.user.findUnique({
        where: { id: userId },
        include: { friends: true },
      });
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('Failed to fetch user by ID');
    }
  }
};
