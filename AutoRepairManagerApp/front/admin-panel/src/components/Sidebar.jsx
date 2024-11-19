import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  ClipboardListIcon,
} from "@heroicons/react/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");

    toast.success("Successfully logged out!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
    });

    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-800 text-white">
      <div className="flex-grow">
        <h1 className="text-2xl font-bold p-4">Admin Panel</h1>
        <nav className="mt-8">
          <ul>
            <li>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center px-4 py-2 hover:bg-gray-700 transition"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/users")}
                className="flex items-center px-4 py-2 hover:bg-gray-700 transition"
              >
                <UsersIcon className="h-5 w-5 mr-2" />
                Users
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/cars")}
                className="flex items-center px-4 py-2 hover:bg-gray-700 transition"
              >
                <ClipboardListIcon className="h-5 w-5 mr-2" />
                Cars
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/carstatuses")}
                className="flex items-center px-4 py-2 hover:bg-gray-700 transition"
              >
                <ClipboardListIcon className="h-5 w-5 mr-2" />
                Car Statuses
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
