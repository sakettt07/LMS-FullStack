import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import BookWebLogo from "../assets/BookWebLogo.png";
import { MdDashboard } from "react-icons/md";
import { RiAdminFill, RiBookShelfLine } from "react-icons/ri";
import { GrCatalogOption, GrLogout } from "react-icons/gr";
import { FaUsers } from "react-icons/fa";
import { GiRead } from "react-icons/gi";
import { IoSettingsSharp } from "react-icons/io5";
import { IoCloseCircle } from "react-icons/io5";
import AddNewAdmin from "../popups/AddNewAdmin";
import {toggleAddNewAdminPopup} from "../store/slices/popupSlice";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent,selectedComponent }) => {
  const dispatch = useDispatch();
  const {addNewAdminPopup} =useSelector(state=>state.popup)
  const { loading, user, message, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [message, error, dispatch, loading, isAuthenticated]);
  return (
    <>
    <aside
      className={`${
        isSideBarOpen ? "left-0" : "-left-full"
      } z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-black text-white flex-col h-full`}
      style={{ position: "fixed" }}
    >
      <div className="px-6 py-4 my-6">
        <img className="w-48 h-44" src={BookWebLogo} alt="BookWebLogo" />
      </div>
      <nav className="flex-1 px-14 space-y-2">
        <button
          className={`w-full py-2 font-medium rounded-md hover:cur
        sor-pointer flex items-center space-x-2 cursor-pointer ${selectedComponent === "Dashboard" ? "bg-gray-700 px-4" : ""}`}
          onClick={() => setSelectedComponent("Dashboard")}
        >
          <MdDashboard className="text-2xl" />
          <span>Dashboard</span>
        </button>
        <button
          className={`w-full py-2 font-medium rounded-md hover:cur
            sor-pointer flex items-center space-x-2 cursor-pointer ${selectedComponent === "Books" ? "bg-gray-700 px-4" : ""}`}
          onClick={() => setSelectedComponent("Books")}
        >
          <RiBookShelfLine className="text-2xl" />
          <span>Books</span>
        </button>
        {/* {isAuthenticated && user?.role === "Admin" && ( */}
          <>
            <button
              className={`w-full py-2 font-medium rounded-md hover:cur
                sor-pointer flex items-center space-x-2 cursor-pointer ${selectedComponent === "Catalog" ? "bg-gray-700 px-4" : ""}`}
              onClick={() => setSelectedComponent("Catalog")}
            >
              <GrCatalogOption className="text-2xl" />
              <span>Catalog</span>
            </button>

            <button
              className={`w-full py-2 font-medium rounded-md hover:cur
                sor-pointer flex items-center space-x-2 cursor-pointer ${selectedComponent === "Users" ? "bg-gray-700 px-4" : ""}`}
              onClick={() => setSelectedComponent("Users")}
            >
              <FaUsers className="text-2xl" />
              <span>Users</span>
            </button>
            <button
              className={`w-full py-2 font-medium rounded-md hover:cur
                sor-pointer flex items-center space-x-2 cursor-pointer ${selectedComponent === "Admin" ? "bg-gray-700 px-4" : ""}`}
              onClick={() => dispatch(toggleAddNewAdminPopup())}
            >
              {/* <FaUsers className="text-2xl" /> */}
              {/* <span>Users</span> */}
              <RiAdminFill className="text-2xl" />
              <span>Admin</span>
            </button>
          </>
        {/* // )} */}
        {isAuthenticated && user?.role === "User" && (
          <>
            <button
              className={`w-full py-2 font-medium rounded-md hover:cur
                sor-pointer flex items-center space-x-2 cursor-pointer ${selectedComponent === "Borrowed Books" ? "bg-gray-700 px-4" : ""}`}
              onClick={() => setSelectedComponent("Borrowed Books")}
            >
              <GrCatalogOption className="text-2xl" />
              <span>Borrowed Books</span>
            </button>
          </>
        )}
        <button
          className={`w-full py-2 font-medium rounded-md hover:cur
            sor-pointer flex items-center space-x-2 cursor-pointer ${selectedComponent === "Credentials" ? "bg-gray-700 px-4" : ""}`}
          // onClick={() => setSelectedComponent("Borrowed Books")}
        >
          <IoSettingsSharp className="text-2xl" />
          <span className="text-nowrap">Credentials</span>
        </button>
      </nav>
      <button className="py-4 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex items-center justify-center space-x-5 mx-auto w-fit"  onClick={handleLogout}>
        <GrLogout className="text-2xl" />
        <span>Logout</span>
      </button>
      <IoCloseCircle className="h-fit w-fit absolute mt-4 top-0 right-4 block md:hidden text-3xl text-white" onClick={()=>setIsSideBarOpen(!isSideBarOpen)} />

    </aside>
        {addNewAdminPopup && <AddNewAdmin />}
        </>
  );
};

export default SideBar;
