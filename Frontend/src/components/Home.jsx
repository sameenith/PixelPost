import React from "react";
import Posts from "./Posts";
import RightSidebar from "./RightSidebar";
import Feed from "./Feed";

export default function Home() {
  return (
    <div className="flex justify-center w-full gap-8">
      <Feed />
      <div className="w-72 hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
}
