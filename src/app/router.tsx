import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import {
  ProtectedRoute,
  GuestOnlyRoute,
  AdminRoute,
} from "@/features/auth/guards";
import { PATHS } from "@/routes/paths";
import { Spinner } from "@/components/feedback/Spinner";

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function Lazy({ component: Component }: { component: React.LazyExoticComponent<React.ComponentType> }) {
  return (
    <Suspense fallback={<PageFallback />}>
      <Component />
    </Suspense>
  );
}

const HomePage = lazy(() => import("@/pages/HomePage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ShopPage = lazy(() => import("@/pages/ShopPage"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));

const AdminDashboardPage = lazy(() => import("@/pages/admin/DashboardPage"));
const AdminProductsPage = lazy(() => import("@/pages/admin/ProductsPage"));
const AdminOrdersPage = lazy(() => import("@/pages/admin/OrdersPage"));
const AdminBlogPage = lazy(() => import("@/pages/admin/BlogAdminPage"));

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: PATHS.HOME, element: <Lazy component={HomePage} /> },
      { path: PATHS.ABOUT, element: <Lazy component={AboutPage} /> },
      { path: PATHS.SHOP, element: <Lazy component={ShopPage} /> },
      { path: PATHS.PRODUCT_PATTERN, element: <Lazy component={ProductDetailPage} /> },
      { path: PATHS.BLOG, element: <Lazy component={BlogPage} /> },
      { path: PATHS.BLOG_POST_PATTERN, element: <Lazy component={BlogPage} /> },
      { path: PATHS.CONTACT, element: <Lazy component={ContactPage} /> },
      { path: PATHS.CART, element: <Lazy component={CartPage} /> },
      {
        path: PATHS.PROFILE,
        element: (
          <ProtectedRoute>
            <Lazy component={ProfilePage} />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.PROFILE_EDIT,
        element: (
          <ProtectedRoute>
            <Lazy component={ProfilePage} />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.PROFILE_ORDERS,
        element: (
          <ProtectedRoute>
            <Lazy component={ProfilePage} />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.CHECKOUT,
        element: (
          <ProtectedRoute>
            <Lazy component={CheckoutPage} />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: PATHS.LOGIN,
        element: (
          <GuestOnlyRoute>
            <Lazy component={LoginPage} />
          </GuestOnlyRoute>
        ),
      },
      {
        path: PATHS.SIGNUP,
        element: (
          <GuestOnlyRoute>
            <Lazy component={SignupPage} />
          </GuestOnlyRoute>
        ),
      },
    ],
  },
  {
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: PATHS.ADMIN, element: <Lazy component={AdminDashboardPage} /> },
      { path: PATHS.ADMIN_PRODUCTS, element: <Lazy component={AdminProductsPage} /> },
      { path: PATHS.ADMIN_ORDERS, element: <Lazy component={AdminOrdersPage} /> },
      { path: PATHS.ADMIN_BLOG, element: <Lazy component={AdminBlogPage} /> },
    ],
  },
  {
    path: "*",
    element: <Lazy component={NotFoundPage} />,
  },
]);
