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
      },
    });
  },
  getAllPosts: async () => {
    return db.post.findMany({
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
  getMyPost: async (postId: string, userId: string) => {
    return db.post.findFirst({
      where: { id: postId, createdById: userId },
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
  getPost: async (postId: string) => {
    return db.post.findFirst({
      where: { id: postId },
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
  watchedPost: async (postId: string) => {
    await db.post.update({
      where: { id: postId },
      data: { watched: { increment: 1 } },
    });

    const post = await db.post.findUnique({
      where: { id: postId, deleted: null },
      select: { watched: true },
    });
    return post?.watched || 0;
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
