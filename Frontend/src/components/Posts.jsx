import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

export default function Posts() {
  const { posts } = useSelector((store) => store.posts);
  return (
    <div className="flex flex-col items-center justify-center">
      {/* It's good practice to add a check for an empty array */}
      {posts && posts.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p>No post are avalibale.</p>
      )}
    </div>
  );
}
