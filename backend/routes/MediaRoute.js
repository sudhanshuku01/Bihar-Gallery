import express from "express";
import {
  AdminGetAllMedia,
  GetAllImages,
  GetAllMedia,
  GetAllVideos,
  GetMediaByCreatorUserName,
  GetMediaBySlugTitle,
  MediaUpload,
  UpdateMedia,
  DeleteMedia,
} from "../controllers/MediaController.js";
import { isAdmin, requireSignIn } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/upload", requireSignIn, MediaUpload);
router.get("/get-media", GetAllMedia);
router.get("/get-images", GetAllImages);
router.get("/get-videos", GetAllVideos);
router.get("/admin-media", requireSignIn, isAdmin, AdminGetAllMedia);
router.get("/get-media/:slugTitle", GetMediaBySlugTitle);
router.put("/update-media/:mediaId", requireSignIn, isAdmin, UpdateMedia);
router.delete("/delete-media/:mediaId", requireSignIn, isAdmin, DeleteMedia);
router.get("/user/:userName", GetMediaByCreatorUserName);
export default router;
