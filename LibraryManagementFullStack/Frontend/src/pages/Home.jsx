import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import SideBar from "../layout/SideBar.jsx";

const Home = () => {
  const [isSideBarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCompontent, setSelectedComponent] = useState("");

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // if (!isAuthenticated) {
  //   return <Navigate to={"/login"} />;
  // }
  return (
    <>
      <div className="relative md:pl-64 flex min-h-screen bg-yellow-800">
        <div className="md:hidden z-10 absolute top-4 right-6 sm:top-4 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white">
          <GiHamburgerMenu
            className="text-2xl"
            onClick={() => setIsSidebarOpen(!isSideBarOpen)}
          />
        </div>
        <SideBar
          isOpen={isSideBarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          setSelectedComponent={setSelectedComponent}
        />
      </div>
    </>
  );
};

export default Home;
