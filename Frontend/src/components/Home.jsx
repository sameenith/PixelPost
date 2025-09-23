import React from "react";
import Posts from "./Posts";
import RightSidebar from "./RightSidebar";
import Feed from "./Feed";
import useGetAllPost from "../hooks/useGetAllPost";

export default function Home() {
  useGetAllPost();
  return (
    <div className="flex justify-center w-full gap-8">
      <Feed />
      <div className="w-72 hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
}
