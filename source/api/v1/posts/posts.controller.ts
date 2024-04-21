import { Request, Response } from "express";
import Post from "../../../data/post";
import fs from "fs/promises";
import { folderPath } from "./posts.upload";

export default {
  getMyPosts: async (req: Request, res: Response) => {
    const userId = req.userId;
    const posts = await Post.getMyPosts(userId);
    res.status(200).json({ posts });
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
    const postId = req.params.postId;

    const post = await Post.getPost(postId);
    if (!post) {
      return res.status(404).json({ msg: "Пост не найден" });
    }

    if (post && post.createdById !== userId) {
      await Post.watchedPost(postId);
    }

    const updatedPost = await Post.getPost(postId);
    res.status(200).json({ watched: updatedPost?.watched || 0 });
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
      res.status(200).json({ post: updatedPost });
    } else {
      await Post.addLikeToPost(postId, userId);
      const updatedPost = await Post.getPost(postId);
      res.status(200).json({ post: updatedPost });
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
