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
import AddService from "../pages/private/dashboard/AddService";
import EditService from "../pages/private/dashboard/EditService";
import Atomcito from "../pages/private/dashboard/Atomcito.tsx"
import Footer from "../components/Footer.tsx"

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
          <Route path="services/add" element={<AddService />} />
          <Route path="services/edit" element={<EditService />} />
          <Route path="atomcito" element={<Atomcito />} />
        </Route>
      </Routes>

      <Chatbot />
      <Footer/>
    </BrowserRouter>
  );
};

export default AppRoutes;