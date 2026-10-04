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

import { ProtectedRoute } from "../components/protectedRoute/ProtectedRoute";
import Chatbot from "../components/chatbot/Chatbot";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Privadas / Dashboard (Protegidas) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Redirección por defecto */}
          <Route index element={<Navigate to="analysis" replace />} />

          {/* Sub-páginas privadas */}
          <Route path="analysis" element={<Analysis />} />
          <Route path="billing" element={<Billing />} />
          <Route path="services/add" element={<AddService />} />
          <Route path="services/edit" element={<EditService />} />
        </Route>
      </Routes>

      {/* Chatbot dentro del BrowserRouter para que pueda usar hooks de navegación si los necesita */}
      <Chatbot />
    </BrowserRouter>
  );
};

export default AppRoutes;