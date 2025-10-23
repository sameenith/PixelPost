import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetUserProfile from "@/hooks/useGetUserProfile"; // Your custom hook
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Grid3x3,
  Bookmark,
  Clapperboard,
  Tag,
  Badge,
  AtSign,
  Heart,
  MessageCircle,
} from "lucide-react";

// Helper function to get initials from a name
const getInitials = (name = "") => {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  const firstInitial = parts[0][0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

// --- Sub-components for better organization ---

const ProfileHeader = ({ loggedInUser, userProfile }) => {
  const isMyProfile = loggedInUser?._id === userProfile?._id;
  // Placeholder state for following logic
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowUser = () => setIsFollowing(!isFollowing);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-white shadow-md">
          <AvatarImage src={userProfile?.profilePicture} alt="Profile photo" />
          <AvatarFallback className="text-4xl">
            {getInitials(userProfile?.userName)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* User Info & Stats */}
      <div className="flex flex-col gap-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <h1 className="text-2xl font-light text-gray-800">
            {userProfile?.userName}
          </h1>
          {isMyProfile ? (
            <div className="flex gap-2">
              <Link to="/profile/edit">
                <Button
                  variant="secondary"
                  size="sm"
                  className="font-semibold h-8"
                >
                  Edit Profile
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="sm"
                className="font-semibold h-8"
              >
                View Archive
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleFollowUser}
                size="sm"
                className={`font-semibold h-8 ${
                  isFollowing ? "" : "bg-sky-500 hover:bg-sky-600"
                }`}
                variant={isFollowing ? "secondary" : "default"}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="font-semibold h-8"
              >
                Message
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-8 text-md">
          <div className="flex flex-col items-center justify-center ">
            <span className="font-semibold ">
              {userProfile?.posts?.length || 0}
            </span>{" "}
            posts
          </div>
          <div className="flex flex-col items-center justify-center ">
            <span className="font-semibold">
              {userProfile?.followers?.length || 0}
            </span>{" "}
            followers
          </div>
          <div className="flex flex-col items-center justify-center ">
            <span className="font-semibold">
              {userProfile?.following?.length || 0}
            </span>{" "}
            following
          </div>
        </div>
        <div>
          {/* --------------------------------------------------- */}
          <h2 className="font-semibold  text-gray-800">
            {userProfile?.fullName}
          </h2>
          {/* --------------------------------------------------- */}
          <p className="text-gray-600 max-w-md">
            {userProfile?.bio || "No bio yet."}
          </p>
        </div>
      </div>
    </div>
  );
};

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: "POSTS", icon: Grid3x3 },
    { name: "BOOKMARKS", icon: Bookmark },
    { name: "REELS", icon: Clapperboard },
    { name: "TAGGED", icon: Tag },
  ];

  return (
    <div className="flex items-center justify-center gap-10 text-xs sm:text-sm font-semibold text-gray-400">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name.toLowerCase())}
          className={`flex items-center gap-2 py-3 transition-colors ${
            activeTab === tab.name.toLowerCase()
              ? "text-gray-800 border-t-2 border-gray-800"
              : "hover:text-gray-800"
          }`}
        >
          <tab.icon className="h-4 w-4" />
          {tab.name}
        </button>
      ))}
    </div>
  );
};

const PostGrid = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <h2 className="text-2xl font-bold">No posts yet</h2>
        <p>Upload a photo to see it here.</p>
      </div>
    );
  }
  // console.log(posts[0].image);
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <div
          key={post._id}
          className="relative group aspect-square bg-gray-200"
        >
          <img
            src={post.image}
            alt="Post"
            className="w-full h-full object-cover "
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <div className="flex items-center gap-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="flex items-center gap-2">
                <Heart className="h-6 w-6" fill="white" />
                <span className="font-bold text-lg">
                  {post.likes?.length || 0}
                </span>
              </span>

              <span className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6" fill="white" />
                <span className="font-bold text-lg">
                  {post.comments?.length || 0}
                </span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main Profile Component ---

function Profile() {
  const { id: userId } = useParams();
  useGetUserProfile(userId);

  const loggedInUser = useSelector((store) => store.auth.user);
  const userProfile = useSelector((store) => store.auth.userProfile);
  const [activeTab, setActiveTab] = useState("posts");

  // Show a loading state while fetching profile data
  if (!userProfile) {
    return (
      <div className="text-center mt-10 font-semibold">Loading profile...</div>
    );
  }

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <div className="px-4 sm:px-10">
        <ProfileHeader loggedInUser={loggedInUser} userProfile={userProfile} />
      </div>

      <Separator className="my-8" />

      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-4">
        <PostGrid posts={displayedPost} />
      </div>
    </div>
  );
}

export default Profile;
