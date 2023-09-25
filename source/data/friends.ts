import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export default {
  async createOutgoingRequest(userId: number, friendId: number): Promise<void> {
    try {
      const existingUser = await db.user.findUnique({ where: { id: userId } });

      if (!existingUser) {
        throw new Error('User not found');
      }

      await db.friend.create({
        data: {
          userId: userId,
          friendId: friendId,
          status: 'pending',
        },
      });
    } catch (error) {
      console.error('Error creating friend:', error);
      throw new Error('Failed to create friend');
    }
  },
  async acceptFriend(userId: number, friendId: number): Promise<void> {
    try {
      const friendRequest = await db.friend.findFirst({
        where: { userId: friendId, friendId: userId, status: 'pending' },
      });

      if (!friendRequest) {
        throw new Error('Friend request not found');
      }

      await db.friend.update({
        where: { id: friendRequest.id },
        data: { status: 'accepted' },
      });

      await db.friend.create({
        data: {
          userId: userId,
          friendId: friendId,
          status: 'accepted',
        },
      });
    } catch (error) {
      console.error('Error when accepting a friend request:', error);
      throw new Error('Failed to accept friend request');
    }
  },

  async friendRequestAlreadyExists(userId: number, friendId: number): Promise<boolean> {
    try {
      const existingRequest = await db.friend.findFirst({
        where: {
          userId: userId,
          friendId: friendId,
          OR: [{ status: 'pending' }, { status: 'accepted' }],
        },
      });

      return Boolean(existingRequest);
    } catch (error) {
      console.error('Error checking for existing friend request:', error);
      throw new Error('Failed to check for existing friend request');
    }
  },

  // Удаление друга
  async removeFriend(userId: number, friendId: number): Promise<void> {
    try {
      await db.friend.deleteMany({
        where: {
          OR: [
            { userId: userId, friendId: friendId },
            { userId: friendId, friendId: userId },
          ],
        },
      });
    } catch (error) {
      console.error('Ошибка при удалении друга:', error);
      throw new Error('Не удалось удалить друга');
    }
  },
};
