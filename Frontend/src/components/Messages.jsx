import { useNavigate } from "react-router-dom";

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

export const Messages = ({ selectedUser, loggedInUser }) => {
  const [message, setMessage] = useState("");
  const { messages } = useSelector((store) => store.chat);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  // Dummy messages for demonstration
  const dummyMessages = [
    { senderId: loggedInUser._id, text: "Hey, how's it going?" },
    { senderId: selectedUser._id, text: "Hey! Pretty good, you?" },
    {
      senderId: loggedInUser._id,
      text: "Can't complain. Working on the new project.",
    },
    { senderId: selectedUser._id, text: "Oh nice! How's that coming along?" },
  ];

  useEffect(() => {
    // Auto-scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dummyMessages]);

  return (
    <div className="flex-grow p-4 overflow-y-auto">
      <div className="flex flex-col gap-4">
        <ConversationWelcome user={selectedUser} />
        {dummyMessages?.map((msg, index) => (
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
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
