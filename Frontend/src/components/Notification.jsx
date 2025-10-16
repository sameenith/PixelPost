import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotifications } from "@/redux/rtnSlice";

// Helper function to get initials
const getInitials = (name = "") => {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  const firstInitial = parts[0][0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

const NotificationPopover = () => {
  const dispatch = useDispatch();
  const { likeNotification: notifications } = useSelector(
    (store) => store.realTimeNotification
  );

  const handleOpenChange = (isOpen) => {
    if (!isOpen && notifications.length > 0) {
      console.log("Clearing notifications...");
      dispatch(clearNotifications());
    }
  };
  
  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="relative flex items-center p-3 my-1 text-lg font-medium space-x-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 w-full">
          <Heart className="w-7 h-7" strokeWidth={1.5} />
          <span>Notifications</span>

          {notifications.length > 0 && (
            <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              {notifications.length}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Notifications</h4>
          <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.createdAt}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={notification.userDetails?.profilePicture}
                      alt={notification.userDetails?.userName}
                    />
                    <AvatarFallback>
                      {getInitials(notification.userDetails?.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {notification.userDetails?.userName}
                    </span>{" "}
                    liked your post
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-gray-500 py-4">
                No new notifications.
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
