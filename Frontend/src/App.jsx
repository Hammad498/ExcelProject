
import axios from 'axios';
import { useState } from 'react';
import DataTable from './components/DataTable.jsx';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [refreshData, setRefreshData] = useState(0); // To trigger data refresh

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    // Check file type
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid Excel file (.xls or .xlsx)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    try {
      await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
      setFile(null); // Clear file selection
      setRefreshData(prev => prev + 1); // Trigger data refresh
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Failed to upload file: ${error.response?.data?.error || 'Please try again.'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Excel Upload & User Table</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Upload Excel File</h3>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Please ensure your Excel file has columns: <strong>name</strong>, <strong>email</strong>, <strong>age</strong>
        </p>
        
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={uploading}
        />
        
        <button 
          onClick={handleUpload}
          disabled={uploading || !file}
          style={{
            marginLeft: '10px',
            padding: '8px 16px',
            backgroundColor: uploading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
        
        {file && (
          <p style={{ margin: '10px 0', fontSize: '14px' }}>
            Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      <DataTable key={refreshData} />
    </div>
  );
}

export default App;