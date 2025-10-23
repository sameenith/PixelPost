import "./App.css";
import AuthPage from "./components/AuthPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Chat from "./components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { store } from "./redux/store";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRout from "./components/ProtectedRoutes";
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRout>
        <Layout />
      </ProtectedRout>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRout>
            <Home />
          </ProtectedRout>
        ),
      },
      {
        path: "profile/:id",
        element: (
          <ProtectedRout>
            <Profile />
          </ProtectedRout>
        ),
      },
      {
        path: "profile/edit",
        element: (
          <ProtectedRout>
            <EditProfile />
          </ProtectedRout>
        ),
      },
      {
        path: "messages",
        element: (
          <ProtectedRout>
            <Chat />
          </ProtectedRout>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/signup",
    element: <AuthPage />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      // listen all events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
