import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import ManufacturerDashboardLayout from "../pages/Dashboard/ManufacturerDashboard";
import VendorDashboardLayout from "../pages/Dashboard/VendorDashboard";
import CustomerDashboardLayout from "../pages/Dashboard/CustomerDashboard";
import ManufacturerProfile from "../pages/Profile/ManufacturerProfile";
import VendorProfile from "../pages/Profile/VendorProfile";
import CustomerProfile from "../pages/Profile/CustomerProfile";
import Home from "../pages/Home/Home";
import ManufacturerOverview from "../pages/Overview/ManufacturerOverview";
import VendorOverview from "../pages/Overview/VendorOverview";
import CustomerOverview from "../pages/Overview/CustomerOverview";
import Staffs from "../pages/Staffs/Staffs";
import ManufacturerProducts from "../pages/Dashboard/ManufacturerProducts";
import VendorProducts from "../pages/Dashboard/VendorProducts";
import ProductDetailsPage from "../pages/Dashboard/ProductDetailsPage";
import Cart from "../pages/Vendor/Cart";
import OrderDetails from "../pages/Manufacturer/OrderDetails";
import ManufacturerOrders from "../pages/Manufacturer/ManufacturerOrders";
import MyOrders from "../pages/Vendor/MyOrders";
import CartSummaryModal from "../pages/Vendor/components/cart/CartSummaryModal";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes Wrapper */}
      <Route element={<ProtectedRoute />}>
        {/* Manufacturer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['manufacturer']} />}>
          <Route path="/manufacturer" element={<ManufacturerDashboardLayout />}>
            <Route index element={<ManufacturerOverview />} />
            <Route path="product-catalog" element={<ManufacturerProducts />} />
            <Route path="product-catalog/:id" element={<ProductDetailsPage />} />
            <Route path="orders" element={<ManufacturerOrders />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="staffs" element={<Staffs type="manufacturer" />} />
            <Route path="profile" element={<ManufacturerProfile />} />
          </Route>
        </Route>

        {/* Vendor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
          <Route path="/vendor" element={<VendorDashboardLayout />}>
            <Route index element={<VendorOverview />} />
            <Route path="product-catalog" element={<VendorProducts />} />
            <Route path="product-catalog/:id" element={<ProductDetailsPage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="my-orders/:orderId" element={<CartSummaryModal />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="staffs" element={<Staffs type="vendor" />} />
          </Route>
        </Route>

        {/* Customer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/customer" element={<CustomerDashboardLayout />}>
            <Route index element={<CustomerOverview />} />
            <Route path="profile" element={<CustomerProfile />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;