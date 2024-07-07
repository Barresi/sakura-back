import Database from "../clients/database";

const db = Database.instance;

type PostInput = {
  text?: string;
  pictures?: string[];
};

export default {
  createPost: async (post: PostInput, userId: string) => {
    return db.post.create({
      data: { ...post, createdBy: { connect: { id: userId } } },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        likedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        watchedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  },
  getAllPosts: async () => {
    return db.post.findMany({
      where: { deleted: null },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        likedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        watchedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  },
  getMyPost: async (postId: string, userId: string) => {
    return db.post.findFirst({
      where: { id: postId, createdById: userId, deleted: null },
    });
  },
  getPost: async (postId: string) => {
    return db.post.findFirst({
      where: { id: postId, deleted: null },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        likedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        watchedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  },
  getPosts: async (postIds: string[]) => {
    return db.post.findMany({
      where: { id: { in: postIds }, deleted: null },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        likedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        watchedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  },
  getUserWatchedPosts: async (userId: string, postIds: string[]) => {
    const userWatchedPosts = await db.user.findFirst({
      where: { id: userId },
      include: {
        watchedPosts: {
          where: { id: { in: postIds } },
          select: { id: true },
        },
      },
    });

    return userWatchedPosts?.watchedPosts.map((post) => post.id) || [];
  },
  watchedPosts: async (postIds: string[], userId: string) => {
    const currentUser = await db.user.findFirst({
      where: { id: userId },
      include: { watchedPosts: true },
    });

    const newPosts = postIds.filter(
      (postId) => !currentUser?.watchedPosts.find((post) => post.id === postId)
    );

    if (newPosts.length > 0) {
      await db.user.update({
        where: { id: userId },
        data: {
          watchedPosts: {
            connect: newPosts.map((postId) => ({ id: postId })),
          },
        },
      });
    }
  },
  addLikeToPost: async (postId: string, userId: string) => {
    return db.post.update({
      where: { id: postId },
      data: { likedBy: { connect: { id: userId } } },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        likedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  },
  removeLikeFromPost: async (postId: string, userId: string) => {
    return db.post.update({
      where: { id: postId },
      data: { likedBy: { disconnect: { id: userId } } },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        likedBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  },
  deletePost: async (postId: string) => {
    return db.post.delete({
      where: { id: postId },
    });
  },
};
