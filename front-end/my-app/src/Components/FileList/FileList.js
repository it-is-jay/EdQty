import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FileList.css';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // React Router's hook to programmatically navigate

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/listfiles');
      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      setError('Failed to load file list.');
    }
    setLoading(false);
  };

  const handleFileClick = (fileName) => {
    // Navigate to PDF viewer and pass the filename as state
    navigate('/pdfviewer', { state: { fileName } });
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      console.log('File uploaded successfully');
      fetchFileList(); // Refresh file list after upload
    } catch (err) {
      console.error('Failed to upload file:', err);
    }
    setUploading(false);
  };

  if (loading) return <div>Loading files...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="file-list-container">
      <div className="file-list">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <span className="file-name">{file}</span>
            <button className="select-btn" onClick={() => handleFileClick(file)}>
              Select
            </button>
          </div>
        ))}
      </div>
      <div className="upload-section">
        <input
          type="file"
          id="file-upload"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        <button
          className="upload-btn"
          onClick={() => document.getElementById('file-upload').click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </div>
  );
};

export default FileList;
