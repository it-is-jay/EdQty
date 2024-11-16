import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ChatInterface from './Components/ChatInterface/ChatInterface';
import FileList from './Components/FileList/FileList';
import PDFViewer from './Components/PDFPage/PDFViewer';
import VideoViewer from './Components/VideoViewer/VideoViewer';
import TextViewer from './Components/TextViewer/TextViewer';

const Sidebar = () => (
  <div className="sidebar">
    <div className="library-section">
      <h2>EdQty</h2>
      <Link to="/archive" className="sidebar-btn">
        📁 Data Lake
      </Link>
    </div>
    <div className="files-section">
      <h2>Files</h2>
      <Link to="/pdfviewer" className="sidebar-btn">📄 PDF Viewer</Link>
      <Link to="/text" className="sidebar-btn">📝 Text Viewer</Link>
      <Link to="/video" className="sidebar-btn">🎥 Video Viewer</Link>
    </div>
  </div>
);


const TextPage = () => (
  <div className="main-content non-centered-content">
    <h1>Text History</h1>
    <input type="text" placeholder="Search Text history..." className="search-bar" />
  </div>
);


const App = () => (
  <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <Routes>
        <Route path="/archive" element={<FileList />} />
        <Route path="/pdfviewer" element={<PDFViewer />} />
        <Route path="/text" element={<TextViewer />} />
        <Route path="/video" element={<VideoViewer />} />
        <Route path="/" element={<ChatInterface />} /> {/* Default route */}
      </Routes>
    </div>
  </div>
);

export default App;
