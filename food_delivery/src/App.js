// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductList from './pages/product/ProductList';
import ProductDetails from './pages/product/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SignInForm from './pages/login/SignInForm';
import SignUpForm from './pages/login/SignUpForm';
import ForgotPassword from './pages/login/ForgetPassword'; // Add import for ForgotPassword
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalStyle from './styles/GlobalStyle';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import AccountPage from './pages/account/AccountPage';
import LoginSecurityPage from './pages/account/LoginSecurityPage';
import YourOrdersPage from './pages/account/YourOrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageUsers from './pages/admin/ManageUsers';
import ManageOrders from './pages/admin/ManageOrders';
import PrivateAdminRoute from './components/PrivateAdminRoute';
import { AuthProvider } from './contexts/AuthContext';
import AdminFloatingButton from './pages/admin/AdminFloatingButton';

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyle />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add route for ForgotPassword */}
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login-security" element={<LoginSecurityPage />} />
          <Route path="/your-orders" element={<YourOrdersPage />} />
          <Route path="/admin" element={<PrivateAdminRoute><AdminDashboard /></PrivateAdminRoute>} />
          <Route path="/admin/products" element={<PrivateAdminRoute><ManageProducts /></PrivateAdminRoute>} />
          <Route path="/admin/users" element={<PrivateAdminRoute><ManageUsers /></PrivateAdminRoute>} />
          <Route path="/admin/orders" element={<PrivateAdminRoute><ManageOrders /></PrivateAdminRoute>} />
        </Routes>
        <Footer />
        <AdminFloatingButton />
      </Router>
    </AuthProvider>
  );
}

export default App;