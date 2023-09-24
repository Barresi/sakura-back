import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();



export default {
  async createFriend(userId: number, friendId: number): Promise<void> {
    try {
      const data = {
        friendOf: { connect: { id: friendId } },
      };

      const user = await db.user.update({
        where: { id: userId },
        data,
      });

      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error creating friend:', error);
      throw new Error('Failed to create friend');
    }
  },

  async removeFriend(userId: number, friendId: number): Promise<void> {
    try {
      const data = {
        friendOf: {disconnect: {id: friendId}},
      };

      const user = await db.user.update({
        where: {id: userId},
        data,
      });

      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      throw new Error('Failed to remove friend');
    }
  }
};
