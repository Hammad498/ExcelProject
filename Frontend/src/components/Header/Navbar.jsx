import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

function Navbar() {
  const [role, setRole] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Invalid token');
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRole('');
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '15px', padding: '10px', background: '#eee' }}>
      <Link to="/">Home</Link>
      {!isLoggedIn ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Link to="/upload">Upload</Link>
          <Link to="/records">Records</Link>
          <span style={{ fontWeight: 'bold', marginLeft: 'auto' }}>
            Role: {role.toUpperCase()}
          </span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;