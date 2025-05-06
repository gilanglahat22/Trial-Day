import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddRestaurantPage from './pages/AddRestaurantPage';
import EditRestaurantPage from './pages/EditRestaurantPage';
import LoadingSpinner from './components/LoadingSpinner';

// Protected route for admin-only access
const AdminRoute = ({ children }) => {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Admin-only routes */}
        <Route 
          path="add-restaurant" 
          element={
            <AdminRoute>
              <AddRestaurantPage />
            </AdminRoute>
          } 
        />
        <Route 
          path="edit-restaurant/:id" 
          element={
            <AdminRoute>
              <EditRestaurantPage />
            </AdminRoute>
          } 
        />
        
        {/* Fallback route for any other path */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App; 