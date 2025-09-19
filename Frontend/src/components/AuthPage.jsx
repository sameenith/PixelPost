import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// A small, self-contained Spinner component
const Spinner = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75">
    <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
  </div>
);

const AuthPage = () => {
  const [input, setInput] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // State to toggle between Login and Signup views
  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setInput({ userName: "", email: "", password: "" });
  };

  // Placeholder function for form submission
  const handleFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    let res;

    try {
      if (isLoginView) {
        console.log("Submitting Login Data:", input);
        res = await axios.post(
          "/api/v1/user/login",
          { email: input.email, password: input.password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // This is crucial for cookies to be sent and received
          }
        );
        
      } else {
        console.log("Submitting Signup Data:", input);
        res = await axios.post("/api/v1/user/register", input, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      }
      if (res.data.success) {
        toast.success(res.data.message);

        if (!isLoginView) {
          toggleView(); // Switch to login view after successful registration
        } else {
          navigate("/"); 
          setInput({ email: "", password: "" });
        }
      }
    } catch (error) {
      console.log("Error in handleFormSubmit: ", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        {loading && <Spinner />}
        <div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            {isLoginView ? "Welcome Back!" : "Create Your Account"}
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            {isLoginView
              ? "Please sign in to your account"
              : "Get started by creating a new account"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleFormSubmit}>
          {/* --- USERNAME INPUT (Only for Signup) --- */}
          {!isLoginView && (
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  value={input.userName}
                  onChange={changeEventHandler}
                  required
                  className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your username"
                />
              </div>
            </div>
          )}

          {/* --- EMAIL INPUT --- */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                autoComplete="email"
                required
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* --- PASSWORD INPUT --- */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                value={input.password}
                onChange={changeEventHandler}
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* --- SUBMIT BUTTON --- */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "Processing..." : isLoginView ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>

        {/* --- TOGGLE LINK --- */}
        <div className="text-sm text-center">
          <button
            onClick={toggleView}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isLoginView
              ? "Need an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
