import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const Dashboard: React.FC = () => {
  // State to handle the sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">Dashboard</div>
        {/* Mobile Sidebar Toggle Button */}
        <button
          className="lg:hidden p-2 bg-blue-500 rounded-md"
          onClick={toggleSidebar}
        >
          ☰
        </button>
      </header>

      {/* Sidebar + Content Layout */}
      <div className="flex">
        {/* Sidebar - Hidden on Mobile */}
        <nav
          className={`w-64 min-w-[240px] bg-gray-900 text-white h-screen p-4 transition-transform lg:block ${
            isSidebarOpen ? "block" : "hidden"
          } lg:block`} // Mobile: toggle with state; Desktop: always visible
        >
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/dashboard/users"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition ${
                    isActive ? "bg-blue-500" : "hover:bg-gray-700"
                  }`
                }
              >
                List Users
              </NavLink>
            </li>
            {/* Add more links here */}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 ">
          <div className="bg-white shadow-lg rounded-lg">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
