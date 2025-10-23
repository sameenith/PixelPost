import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSidebar";

function Layout() {
  return (
    <div className="flex">
      {/* 1. Make the LeftSideBar sticky */}
      <div className="sticky top-0 h-screen">
        <LeftSideBar />
      </div>

      <main className="flex-grow bg-gray-50 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
