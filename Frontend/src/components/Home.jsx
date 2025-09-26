import React from "react";

import RightSidebar from "./RightSidebar";
import Feed from "./Feed";
import useGetAllPost from "../hooks/useGetAllPost";
import useGetSuggestedUser from "../hooks/useGetSuggestedUser";

export default function Home() {
  useGetAllPost();
  useGetSuggestedUser();
  return (
    <div className="flex justify-center w-full gap-8">
      <Feed />
      <div className="w-72 hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
}
