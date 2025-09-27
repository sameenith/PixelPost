import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

// Helper function to get initials from a name
const getInitials = (name = "") => {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  const firstInitial = parts[0][0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullName: user?.fullName || "",
    userName: user?.userName || "",
    bio: user?.bio || "",
    gender: user?.gender || "",
    profilePicture: null, // For the new file
  });
  const [preview, setPreview] = useState(user?.profilePicture || null);

  const imageRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // This effect ensures the form is populated if the user data loads after the component mounts
    if (user) {
      setInput({
        fullName: user.fullName || "",
        userName: user.userName || "",
        bio: user.bio || "",
        gender: user.gender || "",
        profilePicture: null,
      });
      setPreview(user.profilePicture || null);
    }
  }, [user]);

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePicture: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("userName", input.userName);
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePicture) {
      formData.append("profilePicture", input.profilePicture);
    }

    try {
      const res = await axios.post("/api/v1/user/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        const updatedUserData = { ...user, ...res.data.user };
        console.log(updatedUserData);
        dispatch(setAuthUser(updatedUserData));
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        navigate(`/profile/${user._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl p-4 sm:p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        <form onSubmit={editProfileHandler} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center gap-6 p-4 bg-gray-200 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarImage src={preview} alt="Profile preview" />
              <AvatarFallback>{getInitials(user.userName)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <h2 className="font-semibold">{user.userName}</h2>
              <p className="text-sm text-gray-500">{user.fullName}</p>
            </div>
            <input
              type="file"
              ref={imageRef}
              className="hidden"
              onChange={fileChangeHandler}
              accept="image/*"
            />
            <Button
              type="button"
              variant="link"
              onClick={() => imageRef.current?.click()}
              className="text-sky-500 font-semibold p-0"
            >
              Change photo
            </Button>
          </div>

          {/* Form Fields Section */}
          <div className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="text-sm font-semibold">Full Name</label>
              <input
                type="text"
                value={input.fullName}
                onChange={(e) =>
                  setInput({ ...input, fullName: e.target.value })
                }
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            {/* Username */}
            <div>
              <label className="text-sm font-semibold">Username</label>
              <input
                type="text"
                value={input.userName}
                onChange={(e) =>
                  setInput({ ...input, userName: e.target.value })
                }
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            {/* Bio */}
            <div>
              <label className="text-sm font-semibold">Bio</label>
              <Textarea
                value={input.bio}
                onChange={(e) => setInput({ ...input, bio: e.target.value })}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>
            {/* Gender */}
            <div>
              <label className="text-sm font-semibold">Gender</label>
              <Select onValueChange={selectChangeHandler} value={input.gender}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select a gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-sky-500 hover:bg-sky-600 w-28"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
