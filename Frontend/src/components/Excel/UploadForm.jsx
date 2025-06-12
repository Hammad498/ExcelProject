import React, { useState } from "react";
import axios from "axios";
import PrimeUserTable from "./PrimeUserTable.jsx"; // Fixed: Import correct component

function UploadForm() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [refreshData, setRefreshData] = useState(0);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMsg("Select a file first.");

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid Excel file (.xls or .xlsx)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      await axios.post("http://localhost:3000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("File uploaded successfully!");
      setFile(null);
      setRefreshData((prev) => prev + 1);
      setMsg("Upload successful!");

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setMsg(err.response?.data?.error || "Upload failed");
      alert(
        `Failed to upload file: ${
          err.response?.data?.error || "Please try again."
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Excel Upload & User Table</h1>
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        <h3>Upload Excel File</h3>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Please ensure your Excel file has columns: <strong>name</strong>,{" "}
          <strong>email</strong>, <strong>age</strong>
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
            marginLeft: "10px",
            padding: "8px 16px",
            backgroundColor: uploading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
        <p>{msg}</p>

        {file && (
          <p style={{ margin: "10px 0", fontSize: "14px" }}>
            Selected: <strong>{file.name}</strong> (
            {(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>
      
      <PrimeUserTable key={refreshData} />
    </div>
  );
}

export default UploadForm;