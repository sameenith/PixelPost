import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";
import { toast } from "sonner";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  const firstInitial = parts[0][0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

export default function CommentDialog({ open, setOpen }) {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.posts);
  const [comment, setComment] = useState(selectedPost?.comments);
  const dispatch = useDispatch();

  useEffect(() => {
    if(selectedPost)setComment(selectedPost?.comments);
  }, [selectedPost]);

  const commentHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault;
    try {
      const res = await axios.post(
        `/api/v1/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setText("");
        console.log(res.data);
        const updatedPostComment = [res.data.comment, ...comment];
        setComment(updatedPostComment);

        const updatedPost = posts.map((p) =>
          p._id === selectedPost._id
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl grid grid-cols-2 p-0 gap-0">
        {/* Left Side: Image */}
        <div className="rounded-md w-full h-full bg-gray-100 p-1">
          <img
            className="w-full h-full object-cover rounded-md"
            src={selectedPost?.image}
            alt="post_img"
          />
        </div>

        {/* Right Side: Comments and Header */}
        <div className="flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between p-4 border-b">
            {/* User Info Link */}
            <Link to="/profile/username" className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedPost?.author?.profilePicture} />
                <AvatarFallback>
                  {getInitials(selectedPost?.author?.userName)}
                </AvatarFallback>
              </Avatar>
              <DialogTitle className="font-semibold">
                {selectedPost?.author?.userName}
              </DialogTitle>{" "}
            </Link>

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
                <Button variant="ghost" className="w-full cursor-pointer">
                  Delete
                </Button>
              </DialogContent>
            </Dialog>
          </DialogHeader>

          {/* Comments Area */}
          <div className="flex-1 p-4 overflow-y-auto max-h-72">
            {comment?.length > 0 &&
              comment.map((comment, idx) => (
                <Comment key={comment._id} comment={comment} />
              ))}
          </div>

          {/* Comment input area */}
          <div className="flex items-center gap-2 p-4 border-t">
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="Add comment..."
                value={text}
                onChange={commentHandler}
                className="outline-none text-sm w-full"
              />
            </div>
            <button
              // Button is disabled and faded when there is no text
              disabled={!text.trim()}
              onClick={sendMessageHandler}
              className="text-sm font-semibold text-sky-500 cursor-pointer disabled:text-sky-500/40 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
