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
import { useState } from "react";

export default function CommentDialog({ open, setOpen }) {
  const [text, setText] = useState("");
  const commentHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = () => {
    alert(text);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl grid grid-cols-2 p-0 gap-0">
        {/* Left Side: Image */}
        <div className="rounded-md w-full h-full bg-gray-100 p-1">
          {" "}
          {/* Added a bg color */}
          <img
            className="w-full h-full object-cover rounded-md"
            src="https://images.unsplash.com/photo-1600298882438-de4298571be4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="post_img"
          />
        </div>

        {/* Right Side: Comments and Header */}
        <div className="flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between p-4 border-b">
            {/* User Info Link */}
            <Link to="/profile/username" className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <DialogTitle className="font-semibold">username</DialogTitle>{" "}
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
            {" "}
            <p>Comments will go here...</p>
            {/* Example comments to fill space */}
            {[...Array(10)].map((_, i) => (
              <p key={i} className="mb-2 text-sm">
                <span className="font-semibold mr-1">user_{i + 1}</span>
                This is a test comment number {i + 1}. Very insightful!
              </p>
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
