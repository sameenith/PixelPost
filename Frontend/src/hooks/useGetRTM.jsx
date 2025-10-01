/*
import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { messages } = useSelector((store) => store.chat);

  useEffect(() => {
    socket?.on("newMessages", (newMessages) => {
      console.log("realtime is working or not");
      dispatch(setMessages([...(messages || []), newMessages]));
    });

    return () => {
      socket?.off("newMessages");
    };
  }, [messages, setMessages]);
};

export default useGetRTM;
*/

import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { addMessage } from "../redux/chatSlice.js";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
 

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage) => {
        dispatch(addMessage(newMessage));
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket, dispatch]); 
};

export default useGetRTM;

