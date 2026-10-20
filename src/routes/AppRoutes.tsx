import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "../pages/public/Home/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

import Dashboard from "../pages/private/dashboard/Dashboard";
import Analysis from "../pages/private/dashboard/Analysis";
import Billing from "../pages/private/dashboard/Billing";
import AdminServices from "../pages/private/dashboard/AdminServices";
import Atomcito from "../pages/private/dashboard/Atomcito.tsx"

import { ProtectedRoute } from "../components/protectedRoute/ProtectedRoute";
import Chatbot from "../components/chatbot/Chatbot";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="analysis" replace />} />

          <Route path="analysis" element={<Analysis />} />
          <Route path="billing" element={<Billing />} />
          <Route path="admin-services" element={<AdminServices />} />
          <Route
            path="services/*"
            element={
              <Navigate to="/dashboard/admin-services" replace />
            }
          />
          <Route path="atomcito" element={<Atomcito />} />
        </Route>
      </Routes>

      <Chatbot />
    </BrowserRouter>
  );
};

export default AppRoutes;