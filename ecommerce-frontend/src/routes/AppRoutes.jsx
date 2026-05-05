import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><DashboardPage /></Layout>
        </ProtectedRoute>
      }/>
      <Route path="/products" element={
        <ProtectedRoute>
          <Layout><ProductsPage /></Layout>
        </ProtectedRoute>
      }/>
      <Route path="/products/:id" element={
        <ProtectedRoute>
          <Layout><ProductDetailPage /></Layout>
        </ProtectedRoute>
      }/>
      <Route path="/cart" element={
        <ProtectedRoute>
          <Layout><CartPage /></Layout>
        </ProtectedRoute>
      }/>
    </Routes>
  );
}