import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/NavBar";
import Sidebar from "../components/SideBar";

const drawerWidth = 240;

function RootPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div id="root-page">
      <Navbar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <div id="content">
        <Outlet />
      </div>
    </div>
  );
}

export default RootPage;
