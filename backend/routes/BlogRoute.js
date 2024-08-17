import express from "express";
import { isAdmin, requireSignIn } from "../middleware/AuthMiddleware.js";
import {
  GetImageByKey,
  createPost,
  deletePost,
  getPostBySlugTitle,
  getPosts,
  searchPosts,
  updatePost,
} from "../controllers/BlogController.js";
const router = express.Router();

router.get("/", getPosts);
router.get("/search", searchPosts);
router.get("/getImage", GetImageByKey);
router.post("/", requireSignIn, isAdmin, createPost);
router.get("/:slugTitle", getPostBySlugTitle);
router.put("/:id", requireSignIn, isAdmin, updatePost);
router.delete("/:id", requireSignIn, isAdmin, deletePost);

export default router;
