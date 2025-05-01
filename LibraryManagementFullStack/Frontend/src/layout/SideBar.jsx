import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import BookWebLogo from "../assets/BookWebLogo.png";

const SideBar = ({ isSidebarOpen, setIsSidebarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const { loading, user, message, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logoutUser());
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
    <aside
      className={`${
        isSidebarOpen ? "left-0" : "-left-full"
      } z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-black text-white flex-col h-full`}
      style={{position:"fixed"}}
    >
      <div className="px-6 py-4 my-6">
        <img className="w-48 h-44" src={BookWebLogo} alt="BookWebLogo" />
      </div>
      <nav className="flex-1 bg-amber-200 px-14 space-y-2">
        <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cur
        sor-pointer flex items-center space-x-2" onClick={() => setSelectedComponent("Dashboard")}>
          <img src="" alt="icon" />
          <span>Dashboard</span>
        </button>
        <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cur
        sor-pointer flex items-center space-x-2" onClick={() => setSelectedComponent("Dashboard")}>
          <img src="" alt="icon" />
          <span>Dashboard</span>
        </button>
        <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cur
        sor-pointer flex items-center space-x-2" onClick={() => setSelectedComponent("Dashboard")}>
          <img src="" alt="icon" />
          <span>Dashboard</span>
        </button>
        <button className="w-full py-2 font-medium bg-transparent rounded-md hover:cur
        sor-pointer flex items-center space-x-2" onClick={() => setSelectedComponent("Dashboard")}>
          <img src="" alt="icon" />
          <span>Dashboard</span>
        </button>
      </nav>
    </aside>
  );
};

export default SideBar;
