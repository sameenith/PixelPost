import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSidebar";

function Layout() {
  return (
    <div className="flex">
      {/* 1. Make the LeftSideBar sticky */}
      <div className="sticky top-0 h-screen">
        <LeftSideBar />
      </div>

      {/* 2. This main element will now scroll independently */}
      <main className="flex-grow p-4 sm:p-6 md:p-8 bg-gray-50 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
