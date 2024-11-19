import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-4 text-xl font-bold">Admin Panel</div>
      <nav className="mt-4">
        <ul>
          <li className="p-4 hover:bg-gray-700">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link to="/users">Users</Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link to="/cars">Cars</Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link to="/carstatuses">Car Statuses</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
