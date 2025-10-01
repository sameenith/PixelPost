import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, Edit } from "lucide-react";
import useGetSuggestedUsers from "../hooks/useGetSuggestedUser";
import { useNavigate } from "react-router-dom";
import { store } from "@/redux/store";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import { toast } from "sonner";
import { setSelectedUser } from "@/redux/authSlice";
import useGetAllMessages from "@/hooks/useGetAllMessages";
// Helper function to get initials from a name
const getInitials = (name = "") => {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  const firstInitial = parts[0][0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

// --- Sub-components for better organization ---

const ConversationWelcome = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-b">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={user?.profilePicture} alt={user?.userName} />
        <AvatarFallback className="text-3xl">
          {getInitials(user?.userName)}
        </AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-semibold">{user?.userName}</h2>
      <p className="text-sm text-gray-500 mb-4">{user?.fullName}</p>
      <Button
        variant="secondary"
        onClick={() => navigate(`/profile/${user?._id}`)}
      >
        View Profile
      </Button>
    </div>
  );
};

// Represents the main conversation view
const ConversationView = ({ selectedUser, loggedInUser }) => {
  useGetAllMessages();
  const [textMessage, setTextMessage] = useState("");
  const { messages } = useSelector((store) => store.chat);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!textMessage.trim()) return;

    try {
      const res = await axios.post(
        `/api/v1/message/send/${selectedUser?._id}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        console.log(messages);
        dispatch(setMessages([...(messages || []), res.data.newMessage]));
        console.log(res.data.newMessage);

        setTextMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);

      toast.error(error.response?.data?.message || "Failed to send message.");
    }
  };

  useEffect(() => {
    // Auto-scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 p-3 border-b sticky top-0 bg-white z-10">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={selectedUser?.profilePicture}
            alt={selectedUser?.userName}
          />
          <AvatarFallback>{getInitials(selectedUser?.userName)}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{selectedUser?.userName}</h2>
      </div>

      {/* Message Area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <ConversationWelcome user={selectedUser} />
          {messages?.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === loggedInUser._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                  msg.senderId === loggedInUser._id
                    ? "bg-sky-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg?.message}
              </div>
            </div>
          ))}

          {/* <div className=" flex flex-col gap-3">
            {messages?.map((msg) => {
              return (
                <div className="flex">
                  <div>{msg?.message}</div>
                </div>
              );
            })}
          </div> */}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <form className="flex items-center gap-2">
          <Input
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            type="text"
            placeholder="Message..."
            className="flex-grow bg-gray-100 border-none rounded-full focus-visible:ring-sky-500"
          />
          <Button
            type="submit"
            onClick={sendMessageHandler}
            size="icon"
            className="rounded-full bg-sky-500 hover:bg-sky-600"
            disabled={!textMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

// The placeholder view when no user is selected
const NoChatSelected = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <MessageSquare className="h-24 w-24 text-gray-300" strokeWidth={1} />
    <h2 className="mt-4 text-2xl font-light text-gray-800">Your Messages</h2>
    <p className="text-gray-500">Select a conversation to start chatting.</p>
  </div>
);

// --- Main Chat Page Component ---

const ChatPage = () => {
  useGetSuggestedUsers(); // Fetches users and puts them in the Redux store
  const dispatch = useDispatch();

  const loggedInUser = useSelector((store) => store.auth.user);
  const { suggestedUser, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers } = useSelector((store) => store.chat);

  useEffect(() => {
    dispatch(setSelectedUser(null));
  }, []);

  return (
    <div className="flex h-screen bg-white border-t">
      {/* Left Column: User List */}
      <section className="w-1/3 border-r h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{loggedInUser?.userName}</h1>
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-2">
          {suggestedUser?.map((user) => {
            const isOnline = onlineUsers.includes(user?._id);
            return (
              <div
                onClick={() => dispatch(setSelectedUser(user))}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedUser?._id === user._id
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <Avatar className="h-14 w-14 border-2 border-transparent">
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.userName}
                  />
                  <AvatarFallback>{getInitials(user?.userName)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h2 className="font-semibold text-sm">{user?.userName}</h2>
                  <p
                    className={`text-xs ${
                      isOnline ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right Column: Conversation */}
      <section className="w-2/3 h-full">
        {selectedUser ? (
          <ConversationView
            selectedUser={selectedUser}
            loggedInUser={loggedInUser}
          />
        ) : (
          <NoChatSelected />
        )}
      </section>
    </div>
  );
};

export default ChatPage;
