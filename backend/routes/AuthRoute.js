import express from "express";
import formidable from "express-formidable";

import {
  SignupController,
  LoginController,
  VerifyEmail,
  UserProfile,
  CheckUserName,
  UpdateUser,
  GetUserImage,
  CheckAdmin,
  CheckTokenValid,
  GoogleLogin,
  GoogleLoginWithExistingEmail,
} from "../controllers/AuthController.js";

import { isAdmin, requireSignIn } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.put("/update-user/:userId", requireSignIn, formidable(), UpdateUser);

router.get("/user/getimage/:userId", GetUserImage);

router.post("/signup", SignupController);

router.get("/is-admin/:userId", CheckAdmin);

router.post("/login", LoginController);

router.post("/googlelogin", GoogleLogin);

router.post("/googleloginwithexistingemail", GoogleLoginWithExistingEmail);

router.get("/verify-email", VerifyEmail);

router.post("/check-username", CheckUserName);

router.get("/user/:userName", UserProfile);

router.post("/isvalid-token", requireSignIn, CheckTokenValid);

export default router;
