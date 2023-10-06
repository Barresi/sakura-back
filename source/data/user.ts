import Database from "@src/clients/database";

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
  getByEmail: function (email: string) {
    return db.user.findUnique({ where: { email } });
  },
  getById: function getById(userId: number) {
    try {
      return db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
        },
      });
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("Failed to fetch user by ID");
    }
  },
};
