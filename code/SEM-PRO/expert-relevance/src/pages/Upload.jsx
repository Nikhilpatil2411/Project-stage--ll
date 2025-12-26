// src/pages/Upload.jsx
import React, { useState } from "react";
import Layout from "../components/Layout"; // since Layout is in components

const Upload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    alert(`Uploaded file: ${file.name}`);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-[400px] text-center">
          <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
          <form onSubmit={handleUpload}>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="mb-4 border p-2 w-full"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
            >
              Upload
            </button>
          </form>
          {file && (
            <p className="mt-4 text-sm text-gray-600">
              Selected file: <strong>{file.name}</strong>
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Upload; // 👈 must exist
