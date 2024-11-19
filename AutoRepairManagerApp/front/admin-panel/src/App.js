import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Users from "./pages/Users";
import Cars from "./pages/Cars";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import CarStatuses from "./pages/CarStatuses";

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/carstatuses" element={<CarStatuses />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
