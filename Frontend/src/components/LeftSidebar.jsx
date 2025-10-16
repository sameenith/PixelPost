import React, { useState } from "react";
import {
  Home,
  Search,
  LogOut,
  Compass,
  MessageCircleCode,
  Heart,
  SquarePlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import NotificationPopover from "./Notification";

// This function takes a name and returns the initials.
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";

  const firstInitial = parts[0][0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
};

// This is a reusable component for each navigation link
const NavLink = ({ icon: Icon, text, to }) => {
  return (
    <Link
      to={to}
      className="flex items-center p-3 my-1 text-lg font-medium space-x-4 text-gray-700  hover:bg-gray-100 rounded-lg transition-colors duration-200"
    >
      <Icon className="w-7 h-7" strokeWidth={1.5} />
      <span>{text}</span>
    </Link>
  );
};

const LeftSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [isCreateOpen, setIsCreateOpen] = useState(false);


  // Placeholder for logout functionality
  const handleLogout = async () => {
    console.log("Logout clicked");
    try {
      const res = await axios.get("/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen p-4 bg-white border-r border-gray-200 w-72">
        {/* Logo */}
        <div className="mb-10 text-center font-bold text-3xl text-blue-600">
          PixelPost
        </div>

        {/* Navigation */}
        <nav className="flex-grow">
          <NavLink icon={Home} text="Home" to="/"></NavLink>
          <NavLink icon={Search} text="Search" to="/search"></NavLink>
          <NavLink icon={Compass} text="Explore" to="/explore"></NavLink>
          <NavLink
            icon={MessageCircleCode}
            text="Messages"
            to="/messages"
          ></NavLink>

          {/* <NavLink
            icon={Heart}
            text="Notifications"
            to="/notifications"
          ></NavLink> */}

          <NotificationPopover />

          {/* create Post feature */}
          <button
            onClick={() => {
              setIsCreateOpen(true);
            }}
            className="flex items-center w-full p-3 my-1 text-lg font-medium text-left space-x-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <SquarePlus className="w-7 h-7" strokeWidth={1.5} />
            <span>Create</span>
          </button>

          {user && (
            <Link
              to={`/profile/${user?._id}`}
              className="flex items-center p-3 my-1 text-lg font-medium space-x-4 text-gray-700  hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {user?.profilePicture ? (
                <img
                  src={user?.profilePicture}
                  alt="User Avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                // Otherwise, show the dynamically generated initials image
                <img
                  src={`https://placehold.co/100x100/EFEFEFF/3EA6FF?text=${getInitials(
                    user?.userName
                  )}`}
                  alt="User Initials"
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}
              <span>Profile</span>
            </Link>
          )}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 space-x-4 text-lg font-medium text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100"
          >
            <LogOut className="w-7 h-7" strokeWidth={1.5} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <CreatePost open={isCreateOpen} setOpen={setIsCreateOpen} />
    </>
  );
};

export default LeftSideBar;
