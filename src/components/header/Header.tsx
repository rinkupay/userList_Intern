import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">

        <Link to="/" className="text-2xl font-bold flex items-center">
          
          <span className="hidden lg:inline ml-2">Dashboard</span> 
        </Link>

      
        <nav className="">
          <ul className="flex space-x-6">
            <li>
              <Link to="/dashboard/users" className="hover:text-gray-200 transition">List Users</Link>
            </li>
           
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
