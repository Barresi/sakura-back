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
        include: {
          friends: {
            select: {
              status: true,
              friend: { select: { id: true, email: true } },
            },
          },
          friendOf: {
            select: {
              status: true,
              user: { select: { id: true, email: true } },
            },
          },
        },
      });

      if (!user) {
        throw new Error('Failed to fetch user by ID');
      }

      const friends = user.friends
        .filter(({ status }) => status === 'accepted')
        .map(({ friend }) => ({
          id: friend.id,
          email: friend.email,
        }));

      const outgoingRequests = user.friends
        .filter(({ status }) => status === 'pending')
        .map(({ friend }) => ({
          id: friend.id,
          email: friend.email,
        }));

      const friendOf = user.friendOf
        .filter(({ status }) => status === 'pending')
        .map(({ user }) => ({
          id: user.id,
          email: user.email,
        }));

      return {
        ...user,
        friends,
        outgoingRequests,
        friendOf,
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('Failed to fetch user by ID');
    }
  },
};
