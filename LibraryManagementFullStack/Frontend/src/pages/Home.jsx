import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import SideBar from "../layout/SideBar.jsx";
import AdminDashBoard from "../components/AdminDashBoard.jsx";
import UserDashBoard from "../components/UserDashBoard.jsx";
import Catalog from "../components/Catalog.jsx";
import Users from "../components/Users.jsx";
import Books from "../components/Books.jsx";
import BorrowedBooks from "../components/BorrowedBooks.jsx";

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
          isSideBarOpen={isSideBarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          setSelectedComponent={setSelectedComponent}
          selectedComponent={selectedCompontent}
        />
        {(() => {
          switch (selectedCompontent) {
            case "Dashboard":
              return user?.role === "User" ? (
                <UserDashBoard />
              ) : (
                <AdminDashBoard />
              );

            case "Books":
              return <Books />;

            case "Catalog":
              if (user?.role === "Admin") {
                return <Catalog />;
              }
              break;

            case "Users":
              if (user?.role === "Admin") {
                return <Users />;
              }
              break;

            case "Borrowed Books":
              return <BorrowedBooks />;

            default:
              return user?.role === "User" ? (
                <UserDashBoard />
              ) : (
                <AdminDashBoard />
              );
          }
        })()}
      </div>
    </>
  );
};

export default Home;
