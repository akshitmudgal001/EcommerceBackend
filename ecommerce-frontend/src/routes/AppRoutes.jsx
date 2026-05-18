import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage          from "../pages/LoginPage";
import RegisterPage       from "../pages/RegisterPage";
import DashboardPage      from "../pages/DashboardPage";
import ProductsPage       from "../pages/ProductsPage";
import ProductDetailPage  from "../pages/ProductDetailPage";
import CartPage           from "../pages/CartPage";
import CheckoutPage       from "../pages/CheckoutPage";
import OrderHistoryPage   from "../pages/OrderHistoryPage";
import ProfilePage        from "../pages/ProfilePage";
import AdminPage          from "../pages/admin/AdminPage";
import ProtectedRoute     from "../components/ProtectedRoute";
import UserRoute          from "../components/UserRoute";
import AdminRoute         from "../components/AdminRoute";
import Layout             from "../components/Layout";

// User-only shopping pages — admin is redirected away
const USER_ROUTES = [
  { path: "/dashboard",    El: DashboardPage    },
  { path: "/products",     El: ProductsPage     },
  { path: "/products/:id", El: ProductDetailPage },
  { path: "/cart",         El: CartPage         },
  { path: "/checkout",     El: CheckoutPage     },
  { path: "/orders",       El: OrderHistoryPage },
  { path: "/profile",      El: ProfilePage      },
];

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Navigate to="/login" replace />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User-only shopping routes */}
      {USER_ROUTES.map(({ path, El }) => (
        <Route key={path} path={path} element={
          <UserRoute>
            <Layout><El /></Layout>
          </UserRoute>
        }/>
      ))}

      {/* Admin-only panel — has its own layout with sidebar */}
      <Route path="/admin/*" element={
        <AdminRoute><AdminPage /></AdminRoute>
      }/>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}