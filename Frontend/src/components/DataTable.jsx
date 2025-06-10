import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DataTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async (searchTerm = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:3000/api/users?search=${encodeURIComponent(searchTerm)}`);
      setUsers(res.data || []); // Ensure it's always an array
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
      setUsers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fixed useEffect - removed the (e) parameter which was causing issues
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchUsers(value);
  };

  return (
    <div>
      <h2>User Data</h2>
      <input
        type="text"
        placeholder="Search by name/email"
        value={search}
        onChange={handleSearch}
      />
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!loading && !error && users.length === 0 && (
        <p>No users found. Upload an Excel file to see data.</p>
      )}
      
      {users.length > 0 && (
        <table border="1" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px' }}>Name</th>
              <th style={{ padding: '8px' }}>Email</th>
              <th style={{ padding: '8px' }}>Age</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id || i}>
                <td style={{ padding: '8px' }}>{u.name || 'N/A'}</td>
                <td style={{ padding: '8px' }}>{u.email || 'N/A'}</td>
                <td style={{ padding: '8px' }}>{u.age || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DataTable;