import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/public/Home/Home";
import Login from "../pages/public/Login/Login.tsx";
import Register from "../pages/public/Register/Register.tsx";
import AdminAddService from "../pages/private/dashboard/AdminServices/AdminAddService.tsx";
import AdminComprobante from "../pages/private/dashboard/AdminServices/AdminComprobantes.tsx";
import AdminUploadInvoice from "../pages/private/dashboard/AdminServices/AdminUploadInvoice.tsx";
import Notifications from "../pages/private/Notifications.tsx";

import Dashboard from "../pages/private/dashboard/Dashboard";
import Analysis from "../pages/private/dashboard/Analysis";
import Simulator from "../pages/private/dashboard/Simulator";
import Billing from "../pages/private/dashboard/Billing";
import AdminServices from "../pages/private/dashboard/AdminServices/AdminServices.tsx";
import Atomcito from "../pages/private/Atomcito.tsx";
import VerifyEmail from "../pages/private/VerifyEmail.tsx";
import { ProtectedRoute } from "../components/protectedRoute/ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="analysis" replace />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="billing" element={<Billing />} />
          <Route path="admin-services" element={<AdminServices />} />
          <Route path="admin-servicios/agregar" element={<AdminAddService />} />
          <Route
            path="admin-servicios/comprobantes"
            element={<AdminComprobante />}
          />
          <Route
            path="admin-servicios/cargar"
            element={<AdminUploadInvoice />}
          />
          <Route
            path="services/*"
            element={<Navigate to="/dashboard/admin-services" replace />}
          />
          <Route path="atomcito" element={<Atomcito />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
