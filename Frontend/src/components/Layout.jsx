import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSidebar";

function Layout() {
  return (
    <>
      Layout
      <LeftSideBar/>
      <Outlet />
    </>
  );
}

export default Layout;
