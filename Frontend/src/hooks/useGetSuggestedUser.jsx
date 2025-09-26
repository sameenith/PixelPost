import { setSuggestedUser } from "../redux/authSlice.js";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUser = async () => {
      try {
        const res = await axios.get("/api/v1/user/suggested", {
          withCredentials: true,
        });

        if (res.data.success) {
          console.log(res.data.users);
          dispatch(setSuggestedUser(res.data.users));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchSuggestedUser();
  }, []);
};

export default useGetSuggestedUser;
