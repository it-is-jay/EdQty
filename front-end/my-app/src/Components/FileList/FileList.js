// FileList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FileList.css';
import TextEditor from '../TextEditor/TextEditor';  // Import TextEditor

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editorValue, setEditorValue] = useState(''); // Text editor content
  const navigate = useNavigate();

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://100.109.130.18:5000/api/listfiles');
      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      setError('Failed to load file list.');
    }
    setLoading(false);
  };

  const handleFileClick = async (fileName) => {
    const response = await fetch("http://100.109.130.18:5000/api/select-file", {
      method: 'POST',
      body: JSON.stringify({ filename: fileName }),
    });
    navigate('/pdfviewer', { state: { fileName } });
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch("http://100.109.130.18:5000/api/upload", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed with status ${response.status}");
      }

      console.log('File uploaded successfully');
      fetchFileList();
    } catch (err) {
      console.error('Failed to upload file:', err);
    }
    setUploading(false);
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);  // Update text editor content
  };

  if (loading) return <div className="text-center my-5">Loading files...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container-fluid my-4">
      <div className="row">
        

        <div className="col-md-9 col-lg-10">
          <h2 className="text-center mb-4">File Library</h2>

          <div className="d-flex mb-4">
            <div className="flex-grow-1">
              {/* Text Editor on the left side */}
              <TextEditor value={editorValue} onChange={handleEditorChange} />
            </div>

            <div className="flex-shrink-1" style={{ marginLeft: '20px' }}>
              {/* File list section */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="file-list">
                    {files.length === 0 ? (
                      <p className="text-center text-muted">No files available.</p>
                    ) : (
                      files.map((file, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                          <span className="file-name">{file}</span>
                          <button className="btn btn-outline-primary btn-sm" onClick={() => handleFileClick(file)}>
                            View
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="upload-section text-center">
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                />
                <button
                  className="btn btn-success"
                  onClick={() => document.getElementById('file-upload').click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Upload File'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileList;