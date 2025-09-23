import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import CommentDialog from "./CommentDialog";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  const firstInitial = parts[0][0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

export default function Post({ post }) {
  const [text, setText] = useState("");
  const [comment, setComment] = useState(post.comments);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(
    post?.likes.includes(user?._id) || false
  );
  const [postLike, setPostLike] = useState(post.likes.length);

  const likeOrDislikeHandler = async () => {
    try {
      const action = isLiked ? "dislike" : "like";
      const res = await axios.post(
        `/api/v1/post/${post?._id}/${action}`,
        null,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const newPostLike = isLiked ? postLike - 1 : postLike + 1;
        setPostLike(newPostLike);
        setIsLiked(!isLiked);

        // we have to update our post
        const updatedPost = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: isLiked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPost));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Failed to like or dislike post:", error);
      const errorMessage =
        error.response?.data?.message || "Could not like/dislike.";
      toast.error(errorMessage);
    }
  };

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
 
  const commentHandler = async (e) => {
    e.preventDefault;
    try {
      const res = await axios.post(
        `/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedPostComment = [...comment, res.data.comment];
        setComment(updatedPostComment);

        const updatedPost = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                comments: updatedPostComment,
              }
            : p
        );
        dispatch(setPosts(updatedPost));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      const errorMessage =
        error.response?.data?.message || "Could not add comment.";
      toast.error(errorMessage);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`/api/v1/post/delete/${post?._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const updatePosts = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatePosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      const errorMessage =
        error.response?.data?.message || "Could not delete post.";
      toast.error(errorMessage);
    }
  };

  // //function to handle the form submission
  // const handleCommentSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!text.trim()) return;

  //   try {
  //     // This is where you would send the comment to your backend API
  //     const res = await axios.post(
  //       `/api/v1/comment/add/${post._id}`,
  //       { text },
  //       { withCredentials: true }
  //     );

  //     if (res.data.success) {
  //       toast.success("Comment posted!");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to post comment.");
  //   } finally {
  //     setText(""); // Clear the input field
  //   }
  // };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      {/* Post Header */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center justify-between">
        {post?.author && (
          <Link
            to={`/profile/${post.author._id}`}
            className="flex items-center gap-2"
          >
            <Avatar>
              {/* You can replace this src with a dynamic one from props */}
              <AvatarImage src={post.author?.profilePicture} alt="post_image" />
              <AvatarFallback>
                {getInitials(post.author.userName)}
              </AvatarFallback>
            </Avatar>
            <h1 className="font-semibold">{post.author.userName}</h1>
          </Link>
        )}

        {/* Dialog for Post Options */}

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center w-fit">
            <Button
              variant="ghost"
              className="w-full cursor-pointer text-[#ED4956] font-bold "
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="w-full cursor-pointer">
              Add to favorites
            </Button>
            {user?._id === post?.author._id && (
              <Button
                variant="ghost"
                onClick={deletePostHandler}
                className="w-full cursor-pointer"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Placeholder for the Post Image/Content */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-4 overflow-hidden rounded-md aspect-[4/5] bg-gray-100">
        <img
          className="w-full h-full object-cover" // Added classes
          src={post.image}
          alt="post_img"
        />
      </div>

      {/* Placeholder for Post Actions (Like, Comment, Share) */}
      {/* ---------------------------------------------------------------- */}

      <div className="flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-4">
          {isLiked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              className="text-red-500 h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              className="h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
            />
          )}
          <MessageCircle
            onClick={() => setOpen(true)}
            className="h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
          />
          <Send className="h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-110 active:scale-95" />
        </div>
        <Bookmark className="h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-110 active:scale-95" />
      </div>

      <div className="mt-2 space-y-1 text-sm">
        <span className="font-semibold">{postLike} likes</span>
        <p>
          <Link
            to={`/profile/${post.author?._id}`}
            className="mr-2 font-semibold"
          >
            {post.author?.userName}
          </Link>
          {post.caption}
        </p>
        <span
          onClick={() => setOpen(true)}
          className="text-gray-500 cursor-pointer"
        >
          view all {comment.length} comments
        </span>
      </div>
      <CommentDialog open={open} setOpen={setOpen} />

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Add comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-sky-500 font-semibold cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}
