import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Header/Navbar.jsx';
import Login from './components/Authentication/Login.jsx';
import Register from './components/Authentication/Register.jsx';
import UploadForm from './components/Excel/UploadForm.jsx';
import DataTable from './components/Excel/PrimeUserTable.jsx';

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register'];
  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/upload"
          element={isAuthenticated() ? <UploadForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/records"
          element={isAuthenticated() ? <DataTable /> : <Navigate to="/login" />}
        />
        {/* Fixed: Add home route and redirect unauthenticated users to login */}
        <Route 
          path="/" 
          element={isAuthenticated() ? <Navigate to="/records" /> : <Navigate to="/login" />} 
        />
        <Route 
          path="*" 
          element={isAuthenticated() ? <Navigate to="/records" /> : <Navigate to="/login" />} 
        />
      </Routes>
    </>
  );
};

export default AppRoutes;