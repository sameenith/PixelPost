import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import CommentDialog from "./CommentDialog";

export default function Post() {
  // 1. Added state to track if the post is liked
  const [isLiked, setIsLiked] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const commentHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      {/* Post Header */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            {/* You can replace this src with a dynamic one from props */}
            <AvatarImage src="https://github.com/shadcn.png" alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="font-semibold">username</h1>
        </div>

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
            <Button variant="ghost" className="w-full cursor-pointer">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Placeholder for the Post Image/Content */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-4 overflow-hidden rounded-md aspect-[4/5] bg-gray-100">
        <img
          className="w-full h-full object-cover" // Added classes
          src="https://images.unsplash.com/photo-1600298882438-de4298571be4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="post_img"
        />
      </div>

      {/* Placeholder for Post Actions (Like, Comment, Share) */}
      {/* ---------------------------------------------------------------- */}

      <div className="flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-4">
          {isLiked ? (
            <FaHeart
              onClick={toggleLike}
              className="text-red-500 h-6 w-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
            />
          ) : (
            <FaRegHeart
              onClick={toggleLike}
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

      <span>1k likes</span>
      <p>
        <span className="mr-2 font-medium">username</span>
        caption
      </p>
      <span
        onClick={() => setOpen(true)}
        className="text-gray-500 text-sm cursor-pointer"
      >
        view all 10 comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Add comment..."
          value={text}
          onChange={commentHandler}
          className="outline-none text-sm w-full"
        />
        {text && <span className="text-[#3BADF8] cursor-pointer">Post</span>}
      </div>
    </div>
  );
}
