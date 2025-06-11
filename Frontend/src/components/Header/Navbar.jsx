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
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.link}>Home</Link>
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <>
            {role === 'admin' && (
              <Link to="/upload" style={styles.link}>Upload</Link>
            )}
            <Link to="/records" style={styles.link}>Records</Link>
          </>
        )}
      </div>

      {isLoggedIn && (
        <div style={styles.right}>
          <span style={styles.roleBadge}>Role: {role.toUpperCase()}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#f5f5f5',
    borderBottom: '1px solid #ddd',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
  },
  left: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '6px 10px',
    borderRadius: '5px',
    transition: 'background 0.3s',
  },
  roleBadge: {
    marginRight: '15px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    padding: '6px 10px',
    borderRadius: '15px',
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    fontSize: '14px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
};

export default Navbar;
