import React, { useState } from 'react';
import './App.css';
import ChatInterface from './Components/ChatInterface/ChatInterface';
import FileList from './Components/FileList/FileList'; // Import modified ArchivePage

const Sidebar = ({ setActivePage }) => {
  return (
    <div className="sidebar">
      <div className="library-section">
        <h2>Library</h2>
        <button className="sidebar-btn active" onClick={() => setActivePage('archive')}>
          <span role="img" aria-label="archive">📁</span> Data Lake
        </button>
      </div>
      <div className="files-section">
        <h2>Files</h2>
        <button className="sidebar-btn" onClick={() => setActivePage('video')}>
          <span role="img" aria-label="video">🎥</span> Accessibility tools
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [activePage, setActivePage] = useState('archive');

  return (
    <div className="app-container">
      <Sidebar setActivePage={setActivePage} />
      <div className="main-content">
        <div className="chat-section">
          <ChatInterface />
        </div>
        {activePage === 'archive' && (
          <div className="file-list-section">
            <FileList />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
