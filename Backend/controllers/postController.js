import sharp from "sharp";
// import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";
import { io, getReceiverSocketId } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const image = req.file;
    const { caption } = req.body;
    const authorId = req.userId;

    if (!image) {
      return res.status(400).json({
        message: "Image not provided",
        success: false,
      });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // const fileUri=getDataUri(optimizedImageBuffer);   //we can use both methods but here 2nd one is simply the manual way of doing what the datauri library does
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New Post Created.",
      post,
      success: true,
    });
  } catch (error) {
    console.log("Error in addNewPost:  ", error);
    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "userName profilePicture" })
      .populate({
        path: "comments",
        options: {
          // <-- Wrap sort in an 'options' object
          sort: { createdAt: -1 },
        },
        populate: { path: "author", select: "userName profilePicture" },
      });

    if (!posts) {
      return res.status(404).json({ message: "No posts found." });
    }

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log("Error in getAllPost: ", error);

    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.userId;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "userName profilePicture" })
      .populate({
        path: "comments",
        options: {
          // <-- Wrap sort in an 'options' object
          sort: { createdAt: -1 },
        },
        populate: { path: "author", select: "userName profilePicture" },
      });

    if (!posts) {
      return res.status(404).json({ message: "No posts found." });
    }

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log("Error in getUserPost: ", error);

    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found.",
        success: false,
      });
    }

    await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });

    // implement socket io for real time notification
    const user = await User.findById(userId).select("userName profilePicture");
    const postOwnerId = post.author.toString();

    if (postOwnerId !== userId) {
      const notification = {
        type: "like",
        userId: userId,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({
      message: "post liked.",
      success: true,
    });
  } catch (error) {
    console.log("Error in likePost: ", error);
    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found.",
        success: false,
      });
    }

    await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });

    // implement socket io for real time notification
    const user = await User.findById(userId).select("userName profilePicture");
    const postOwnerId = post.author.toString();

    if (postOwnerId !== userId) {
      const notification = {
        type: "dislike",
        userId: userId,
        userDetails: user,
        postId,
        message: "Your post was disliked",
      };

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({
      message: "post disliked.",
      success: true,
    });
  } catch (error) {
    console.log("Error in dislikePost: ", error);
    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;

    const { text } = req.body;

    /*------- we dont need this because of findByIdAndUpdate will do this in one step----
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
        success: false,
      });
    }
    */

    // First, create the new comment document
    const newComment = await Comment.create({
      text: text,
      author: userId,
      post: postId,
    });

    // Now, update the post. This will also check if the post exists.
    const updatedPost = await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found.",
        success: false,
      });
    }

    const comment = await Comment.findById(newComment._id).populate({
      path: "author",
      select: "userName profilePicture",
    });

    return res.status(201).json({
      message: "Comment added successfully.",
      comment,
      success: true,
    });
  } catch (error) {
    console.log("Error in likePost: ", error);
    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};

export const getCommentOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "userName profilePicture",
      });

    if (!comments || comments.length === 0) {
      return res.status(404).json({
        message: "Comments not found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log("Error in getCommentOfPost: ", error);
    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postIdToDelete = req.params.id;
    const authorId = req.userId;

    const post = await Post.findById(postIdToDelete);
    if (!post) {
      return res.status(404).json({
        message: "Post not Found",
        success: false,
      });
    }

    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "Unauthorized user",
        success: false,
      });
    }

    await Post.findByIdAndDelete(postIdToDelete);

    /*-----we can do this thing in single line also-------
    const user = await User.findById(authorId);
    if (user) {
      user.posts = user.posts.filter((postid) => postid.toString() !== postIdToDelete);
      await user.save();
    }
    */

    await User.findByIdAndUpdate(authorId, {
      $pull: { posts: postIdToDelete },
    });

    await Comment.deleteMany({ post: postIdToDelete });

    return res.status(200).json({
      message: "Post Deleted.",
      success: true,
    });
  } catch (error) {
    console.log("Error in deletePost: ", error);
    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postIdToBookmark = req.params.id;
    const authorId = req.userId;

    const post = await Post.findById(postIdToBookmark);

    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({
        message: "User Not found. ",
        success: false,
      });
    }
    const isBookmarked = user.bookmarks.includes(postIdToBookmark);
    if (isBookmarked) {
      // means we have remove it from bookmark
      await User.findByIdAndUpdate(authorId, {
        $pull: { bookmarks: postIdToBookmark },
      });

      return res.status(200).json({
        message: "Unbookmarked.",
        success: true,
      });
    } else {
      // means we have to  bookmark
      await User.findByIdAndUpdate(authorId, {
        $addToSet: { bookmarks: postIdToBookmark },
      });

      return res.status(200).json({
        message: "Bookmarked.",
        success: true,
      });
    }
  } catch (error) {
    console.log("Error in deletePost: ", error);
    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};
