import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import UserOrders from './pages/UserOrders';
import AdminDashboard from './pages/admin/Dashboard';
import ManageFood from './pages/admin/ManageFood';
import Orders from './pages/admin/Orders';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* User Protected Routes */}
        <Route path="/my-orders" element={
          <ProtectedRoute>
            <UserOrders />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/food" element={
          <ProtectedRoute role="admin">
            <ManageFood />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute role="admin">
            <Orders />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
