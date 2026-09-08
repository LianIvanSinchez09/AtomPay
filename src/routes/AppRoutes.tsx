import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

import Dashboard from "../pages/private/dashboard/Dashboard";
import Analysis from "../pages/private/dashboard/Analysis";
import Billing from "../pages/private/dashboard/Billing";
import AddService from "../pages/private/dashboard/AddService";
import EditService from "../pages/private/dashboard/EditService";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Página inicial del Dashboard */}
          <Route
            index
            element={<Navigate to="analysis" replace />}
          />

          {/* Páginas del Dashboard */}
          <Route path="analysis" element={<Analysis />} />
          <Route path="billing" element={<Billing />} />
          <Route path="services/add" element={<AddService />} />
          <Route path="services/edit" element={<EditService />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;