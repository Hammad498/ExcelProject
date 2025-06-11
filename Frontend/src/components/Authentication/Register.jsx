import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Fixed: Corrected API endpoint to match login pattern
      await axios.post('http://localhost:3000/api/auth/register', form);
      setMsg('');
      navigate('/login');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p style={{ color: 'red' }}>{msg}</p>
    </div>
  );
}

export default Register;
