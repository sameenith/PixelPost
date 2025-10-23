import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);
  useEffect(() => {
    const fetchAllMessages = async () => {
      if (selectedUser?._id) {
        try {
          const res = await axios.get(
            `/api/v1/message/all/${selectedUser._id}`,
            {
              withCredentials: true,
            }
          );

          if (res.data.success) {
            console.log(res.data.messages);
            dispatch(setMessages(res.data.messages));
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };
    fetchAllMessages();
  }, [selectedUser,dispatch]);
};

export default useGetAllMessages;
