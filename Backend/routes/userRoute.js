import express from "express";
import {
  register,
  login,
  logout,
  editProfile,
  getProfile,
  getSuggestedUsers,
  followOrUnfollow,
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../controllers/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePicture"), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followOrUnfollow/:id").post(isAuthenticated, followOrUnfollow);

export default router;
