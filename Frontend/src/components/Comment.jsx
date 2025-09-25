
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Using shadcn/ui import
import { Link } from "react-router-dom";

// Helper function to get initials from a name
const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  const firstInitial = parts[0][0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

const Comment = ({ comment }) => {
  return (
    <div className="flex items-start gap-3 my-4">
      <Link to={`/profile/${comment?.author?._id}`}>
        <Avatar className="h-8 w-8">

          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback className="text-xs">
            {getInitials(comment?.author?.userName)}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="text-sm">
        <p>
          <Link
            to={`/profile/${comment?.author?._id}`}
            className="font-semibold mr-2 hover:underline"
          >
            {comment?.author?.userName}
          </Link>
          <span>{comment?.text}</span>
        </p>
      </div>
    </div>
  );
};

export default Comment;
