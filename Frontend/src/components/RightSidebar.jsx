import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

// Helper function to get initials from a name
const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  const firstInitial = parts[0][0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

export default function RightSidebar() {
  const { user } = useSelector((store) => store.auth);

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 space-y-6">
      {/* User Profile Section */}
      <div className="flex items-center justify-between">
        <Link to={`/profile/${user?._id}`} className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profilePicture} alt="User profile" />
            <AvatarFallback>{getInitials(user?.userName)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">{user?.userName}</h1>
            <p className="text-xs text-gray-500">{user?.bio}</p>
          </div>
        </Link>
        <button className="text-xs font-semibold text-sky-500">Switch</button>
      </div>

      {/* Suggestions Section (Placeholder) */}
      <div>
        
        <SuggestedUser  />
      </div>
    </div>
  );
}
