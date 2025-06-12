import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      setMsg('');
      navigate('/records');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Login</h2>
        {/* <form onSubmit={handleLogin} style={styles.form} autoComplete="off">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            autoComplete="Email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            autoComplete="Password"

          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form> */}
        <form onSubmit={handleLogin} autoComplete="off" style={styles.form}>
  {/* Trick autofill */}
  <input type="text" name="fake-username" autoComplete="username" style={{ display: 'none' }} />
  <input type="password" name="fake-password" autoComplete="current-password" style={{ display: 'none' }} />

  <input
    name="login_email"
    type="email"
    autoComplete="nope"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    style={styles.input}
  />
  <input
    name="login_password"
    type="password"
    autoComplete="nope"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    style={styles.input}
  />
  <button type="submit" style={styles.button}>
            Login
          </button>

        {msg && <p style={styles.error}>{msg}</p>}

        <div style={styles.registerContainer}>
          <p style={{ margin: 0 }}>Don't have an account?</p>
          <button onClick={() => navigate('/register')} style={styles.registerButton}>
            Register
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
    fontSize: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none',
    transition: 'border 0.2s ease-in-out',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
  },
  registerContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  registerButton: {
    marginTop: '8px',
    background: 'none',
    border: 'none',
    color: '#007bff',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Login;
