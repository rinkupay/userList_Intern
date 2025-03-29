import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Loader from "./components/loader/Loader";
import "./App.css"

// Lazy load components
const LoginSignUp = lazy(() => import("./components/loginSignUp/LoginSignUp"));
const Dashboard = lazy(() => import("./components/dashboard/Dashobard"));
const Users = lazy(() => import("./components/users/Users"));
const UserDetails = lazy(() => import("./components/userDetails/UserDetails"));

const App: React.FC = () => {
  return (
    <Router basename="/">
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginSignUp />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            >
              <Route path="users" element={<Users />} />
              <Route path="user/:id" element={<UserDetails />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
