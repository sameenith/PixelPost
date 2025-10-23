import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
  addNewPost,
  getAllPost,
  getUserPost,
  likePost, // Assumes this is the toggle like/unlike function
  addComment,
  getCommentOfPost,
  deletePost,
  bookmarkPost,
  dislikePost,
} from "../controllers/postController.js";
import upload from "../controllers/multer.js";
const router = express.Router();

// ------------------- Post Routes -------------------

// Create a new post
// POST /api/v1/post/
router
  .route("/addpost")
  .post(isAuthenticated, upload.single("image"), addNewPost);

// Get all posts for the feed
// GET /api/v1/post/feed
router.route("/all").get(isAuthenticated, getAllPost);

// Get a specific user's posts
// GET /api/v1/post/user/:id
router.route("/userpost/all").get(isAuthenticated, getUserPost);

// Delete a post
// DELETE /api/v1/post/:id
router.route("/delete/:id").delete(isAuthenticated, deletePost);

// ------------------- Post Interaction Routes -------------------

// Toggle like/unlike on a post
// POST /api/v1/post/:id/like
router.route("/:id/like").post(isAuthenticated, likePost);
router.route("/:id/dislike").post(isAuthenticated, dislikePost);

// Toggle bookmark on a post
// POST /api/v1/post/:id/bookmark
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);

// ------------------- Comment Routes -------------------

// Add a comment to a post
// POST /api/v1/post/:id/comment
router.route("/:id/comment").post(isAuthenticated, addComment);

// Get all comments for a post
// GET /api/v1/post/:id/comments
router.route("/:id/comment/all").get(isAuthenticated, getCommentOfPost);

export default router;
