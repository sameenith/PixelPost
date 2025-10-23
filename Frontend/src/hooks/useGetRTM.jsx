

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../redux/chatSlice.js";
import { setLikeNotification } from "@/redux/rtnSlice.js";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage) => {
        dispatch(addMessage(newMessage));
      };

      socket.on("newMessage", handleNewMessage);

      const handleNotification = (notification) => {
        dispatch(setLikeNotification(notification));
      };
      socket.on("notification", handleNotification);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("notification", handleNotification);
      };
    }
  }, [socket, dispatch]);
};

export default useGetRTM;
