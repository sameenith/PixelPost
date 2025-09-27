import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetUserProfile = (userId) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      dispatch(setUserProfile(null)); 
      try {
        const res = await axios.get(`/api/v1/user/${userId}/profile`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Could not load user profile.");
        dispatch(setUserProfile(null));
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [dispatch, userId]);

  return { loading };
};

export default useGetUserProfile;
