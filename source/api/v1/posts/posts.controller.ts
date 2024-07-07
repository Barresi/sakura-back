import { Request, Response } from "express";
import Post from "../../../data/post";
import Notification from "../../../data/notification";
import fs from "fs/promises";
import { folderPath } from "./posts.upload";

export default {
  getAllPosts: async (req: Request, res: Response) => {
    const posts = await Post.getAllPosts();
    res.status(200).json(posts);
  },
  createPost: async (req: Request, res: Response) => {
    const userId = req.userId;
    const { text } = req.body;
    const files = req.files as Express.Multer.File[];
    const pictures = files.map((file) => file.filename);
    const post = await Post.createPost({ text, pictures }, userId);
    res.status(200).json(post);
  },
  watchedPost: async (req: Request, res: Response) => {
    const userId = req.userId;
    const { postIds } = req.body;

    const posts = await Post.getPosts(postIds);
    if (!posts || posts.length === 0) {
      return res.status(404).json({ msg: "Посты не найдены" });
    }

    const postIdsToUpdate = posts
      .filter((post) => post.createdById !== userId)
      .map((post) => post.id);
    const alreadyWatchedPosts = await Post.getUserWatchedPosts(userId, postIdsToUpdate);
    const newPostIdsToUpdate = postIdsToUpdate.filter(
      (postId) => !alreadyWatchedPosts.includes(postId)
    );

    if (newPostIdsToUpdate.length > 0) {
      await Post.watchedPosts(newPostIdsToUpdate, userId);
    }

    const watchedPosts = await Post.getPosts(postIds);
    res.status(200).json(watchedPosts);
  },
  likedPost: async (req: Request, res: Response) => {
    const userId = req.userId;
    const postId = req.params.postId;

    const post = await Post.getPost(postId);
    if (!post) {
      return res.status(404).json({ msg: "Пост не найден" });
    }

    if (post?.likedBy.find((user) => user.id === userId)) {
      await Post.removeLikeFromPost(postId, userId);
      const updatedPost = await Post.getPost(postId);
      res.status(200).json(updatedPost);
    } else {
      await Post.addLikeToPost(postId, userId);

      const postCreatorId = post.createdBy.id;
      if (postCreatorId !== userId) {
        await Notification.sendLikePostNtf(
          userId,
          postCreatorId,
          postId,
          req.app.get("io")
        );
      }

      const updatedPost = await Post.getPost(postId);
      res.status(200).json(updatedPost);
    }
  },
  deletePost: async (req: Request, res: Response) => {
    const userId = req.userId;
    const postId = req.params.postId;

    const post = await Post.getMyPost(postId, userId);
    if (!post) {
      return res.status(404).json({ msg: "Пост не найден" });
    }
    const deletePictures = post.pictures.map(async (pictureFilename) => {
      const filepath = `${folderPath}/${userId}/${pictureFilename}`;
      await fs.unlink(filepath);
    });

    await Promise.all(deletePictures);
    await Post.deletePost(post.id);

    res.status(200).json({ msg: `Вы удалили пост ${post.id}` });
  },
};
