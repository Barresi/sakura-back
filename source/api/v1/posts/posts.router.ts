import { Router } from "express";
import ctrl from "./posts.controller";
import wrap from "../../../api/async-wrapper";
import guard from "../access-guard";
import { upload } from "./posts.upload";

const posts = Router();

posts.get("/", guard, wrap(ctrl.getMyPosts));
posts.post("/", guard, upload.array("pictures", 10), wrap(ctrl.createPost));
posts.post("/:postId/watched", guard, wrap(ctrl.watchedPost));
posts.patch("/:postId/liked", guard, wrap(ctrl.likedPost));
posts.delete("/:postId", guard, wrap(ctrl.deletePost));

export default posts;
