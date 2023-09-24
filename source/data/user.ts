import Database from '@src/clients/database';

const db = Database.instance;

export default {
  create: function (email: string, hashedPassword: string) {
    return db.user.create({ data: { email, password: hashedPassword } });
  },
  getViaEmail: function (email: string) {
    return db.user.findUnique({ where: { email } });
  },
  async getById(userId: number) {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: { friends: true },
      });
      return user;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('Failed to fetch user by ID');
    }
  }
};
