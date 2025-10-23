import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  const firstInitial = parts[0][0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

const SuggestedUser = () => {
  const { suggestedUser } = useSelector((store) => store.auth);

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex items-center justify-between text-sm mb-4">
        <h2 className="font-semibold text-gray-500">Suggested for you</h2>
        <span className="cursor-pointer font-bold text-xs hover:text-gray-900">
          See All
        </span>
      </div>

      {suggestedUser && suggestedUser.length > 0 ? (
        <div className="space-y-4">
          {suggestedUser.map((user) => (
            <div key={user._id} className="flex items-center justify-between">
              <Link
                to={`/profile/${user?._id}`}
                className="flex items-center gap-3"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profilePicture} alt="User profile" />
                  <AvatarFallback>{getInitials(user?.userName)}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-semibold text-sm hover:underline">
                    {user?.userName}
                  </h1>
                  <p className="text-xs text-gray-500">Suggested for you</p>
                </div>
              </Link>
              <button className="text-xs font-semibold text-sky-500 hover:text-sky-700">
                Follow
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-center text-gray-400 mt-4">
          No user suggestions right now.
        </div>
      )}
    </div>
  );
};

export default SuggestedUser;
