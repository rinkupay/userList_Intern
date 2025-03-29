import React from "react";
import {useLocation} from "react-router-dom"
import Header from "../header/Header";



const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const showHeader = location.pathname !== "/"; 
  
    return (
      <div>
        {showHeader && <Header />}
        {children}
      </div>
    );
  };

  export default Layout