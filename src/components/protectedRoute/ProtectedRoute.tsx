import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store"; 

const ProtectedRoute: React.FC = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);


  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
