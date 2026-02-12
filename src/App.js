import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";
import Login from "./view/auth/Login";
import Register from "./view/auth/Register";
import Home from "./view/Home";
import SubmitHours from './view/user/SubmitHours';
import UserProfile from './view/user/UserProfile';
import AdminHome from "./view/admin/AdminHome";
import ManageUsers from "./view/admin/ManageUsers";
import ManageBranches from "./view/admin/ManageBranches";
import ApproveHours from "./view/admin/ApproveHours";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="submit-hours" element={<SubmitHours />} />
              <Route path="profile" element={<UserProfile />} />
              {/* Add other user routes here */}
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<PrivateRoute adminOnly={true} />}>
            <Route path="/home-admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="branches" element={<ManageBranches />} />
              <Route path="approvals" element={<ApproveHours />} />
              {/* Add other admin routes here */}
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
