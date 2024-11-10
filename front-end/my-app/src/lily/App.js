import React, { useState } from 'react';
import './App.css';

// Sidebar component
const Sidebar = ({ setActivePage, activePage, folders, setFolders}) => {

  const [newFolderName, setNewFolderName] = useState(''); // State for new folder input

  // Function to handle adding a new folder
  const addFolder = () => {
    if (newFolderName.trim()) {
      setFolders([...folders, { name: newFolderName, files: [] }]); // Add new folder to state
      setNewFolderName(''); // Clear input after adding
    }
  };
  const deleteFolder = (folderToDelete) => {
    setFolders(folders.filter(folder => folder !== folderToDelete)); // Remove the selected folder
  };

  return (
      <div className="sidebar">
      {/* Home Section */}
      <div className="home-section">
        <h2>Home</h2>
        <button
          className={`sidebar-btn ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => setActivePage('home')}
        >
          <span role="img" aria-label="home">🏠</span> Home
        </button>
      </div>

      <div className="library-section">
        <h2>Library</h2>
        <button
          className={`sidebar-btn ${activePage === 'history' ? 'active' : ''}`}
          onClick={() => setActivePage('history')}
        >
          <span role="img" aria-label="history">⏰</span> History
        </button>
        <button
          className={`sidebar-btn ${activePage === 'favorite' ? 'active' : ''}`}
          onClick={() => setActivePage('favorite')}
        >
          <span role="img" aria-label="favorite">❤️</span> Favorite
        </button>
        <button
          className={`sidebar-btn ${activePage === 'archive' ? 'active' : ''}`}
          onClick={() => setActivePage('archive')}
        >
          <span role="img" aria-label="archive">📁</span> Archive
        </button>
      </div>

<div className="files-section">
        <h2>Files</h2>
        {/* Render folders dynamically */}
        {folders.map((folder, index) => (
          <div key={index} className="folder-item">
            <button
              className={`sidebar-btn ${activePage === folder ? 'active' : ''}`}
              onClick={() => setActivePage(folder.name)}
            >
              <span role="img" aria-label="folder">📁</span> {folder.name}
            </button>
            {/* Delete Button */}
            <button className="delete-btn" onClick={() => deleteFolder(folder)}>
              ❌
            </button>
          </div>
        ))}

        {/* Input and button to add new folders */}
        <div className="add-folder">
          <input
            type="text"
            placeholder="New Folder"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="folder-input"
          />
          <button onClick={addFolder} className="add-folder-btn">
            ➕ Add Folder
          </button>
        </div>
      </div>
    </div>
  );
};

const FileDisplay = ({ folder }) => {
  return (
    <div className="file-display">
      {folder.files.length > 0 ? (
        folder.files.map((file, index) => (
          <div key={index} className="file-item">
            {/* File Icon */}
            <span role="img" aria-label="file">📄</span>
            {/* File Name */}
            <p>{file}</p>
          </div>
        ))
      ) : (
        <p>No files in this folder.</p>
      )}
    </div>
  );
};

const FolderPage = ({ folder }) => {
  return (
    <div className="main-content">
      <h1>{folder.name}</h1>
      {/* Display Files in Selected Folder */}
      {folder.files.length > 0 ? (
        <FileDisplay folder={folder} />
      ) : (
        <p>No files in this folder.</p>
      )}
    </div>
  );
};
      

// const addFolder = (folderName, fileOrUrl)) => {
//   if (newFolderName.trim()) {
//     setFolders([...folders, newFolderName]);
//     setNewFolderName(''); // Clear input after adding
//   }
// };

// Home Page component (default page)

const HomePage = ({ handleFileUpload, handleUrlSubmit, folders }) => {
    const [urlInput, setUrlInput] = useState(''); // State for URL input
    const [selectedFolder, setSelectedFolder] = useState(folders[0]?.name || '');
    const handleUrlSubmission = (event) => {
      event.preventDefault();
      if (urlInput && selectedFolder) {
        handleUrlSubmit(urlInput, selectedFolder);
        setUrlInput('');
      }
    };
    // Function to clear the URL input
    const clearUrlInput = () => {
      setUrlInput(''); // Clear the input field
    };
  return (
    <div className="main-content centered-content">
      <div className="centered-upload-container">
        <h1>Upload your File or URL link below</h1>
        <select value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)}>
          {folders.map((folder) => (
            <option key={folder.name} value={folder.name}>
              {folder.name}
            </option>
          ))}
        </select>

        <div className="upload-section">
          {/* Upload Button */}
          <label htmlFor="file-upload" className="upload-button">
            📤
          </label>
          <input 
            id="file-upload" 
            type="file" 
            style={{ display: 'none' }} 
            onChange={(e) => handleFileUpload(e, selectedFolder)}
            className="url-input"
          />

          {/* URL Input */}
          <form onSubmit={handleUrlSubmission} className="url-form">
            <input
              type="text"
              placeholder="Enter your URL"
              value={urlInput} // Bind input value to state
              onChange={(e) => setUrlInput(e.target.value)} // Update state on change
              className="url-input"
            />
            {/* Clear Button */}
            {urlInput && (
              <button type="button" className="clear-button" onClick={clearUrlInput}>
                ✖️
              </button>
            )}
            {/* Submit Button */}
            <button type="submit">Submit URL</button>
          </form>
        </div>
        {folders.find(folder => folder.name === selectedFolder) && (
          <FileDisplay folder={folders.find(folder => folder.name === selectedFolder)} />
        )}
      </div>
    </div>
  );
};


// Individual page components
const HistoryPage = () => (
  <div className="main-content non-centered-content">
    <h1>History</h1>
    <input type="text" placeholder="Search History" className="search-bar" />
  </div>
);

const FavoritePage = () => (
  <div className="main-content non-centered-content">
    <h1>Favorite</h1>
    <input type="text" placeholder="Search Favorites" className="search-bar" />
  </div>
);

const ArchivePage = () => (
  <div className="main-content non-centered-content">
    <h1>Archive</h1>
    <input type="text" placeholder="Search Archive" className="search-bar" />
  </div>
);

const VideoPage = ({ setActivePage }) => {
  const [chatInput, setChatInput] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://172.20.10.14:5000/api/prompt-video", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "url": chatInput, "query": "Summarize" }),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(`Success: ${JSON.stringify(data)}`);
      } else {
        setResponseMessage(`Error: ${response.statusText}`);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="main-content video-page">
      {/* Back button */}
      <button className="back-button" onClick={() => setActivePage('home')}>
        ⬅️ Back to Main
      </button>

      {/* Video and Chat section */}
      <div className="video-chat-container">
        {/* Video section */}
        <div className="video-container">
          <img 
            src="https://example.com/path/to/your/image.jpg"
            alt="Video File Representation"
            className="video-image"
          />
          <textarea placeholder="Start typing your note..." className="note-area"></textarea>
        </div>

        {/* Chat section */}
        <div className="chat-container">
          <h3>Chat</h3>
          <form onSubmit={handleChatSubmit}>
            <input
              type="text"
              placeholder="Type your question here..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="chat-input"
            />
            <button type="submit">Send</button>
          </form>

          {responseMessage && (
            <p className={`response-message ${responseMessage.startsWith('Success') ? 'success' : 'error'}`}>
              {responseMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  const [activePage, setActivePage] = useState('home'); // Default page
  const [folders, setFolders] = useState([{ name: 'Lecture Video', files: [] }]); // Initial folders
  const handleFileUpload = (event, folderName) => {
    const file = event.target.files[0];
    if (file && folderName) {
      console.log(`File uploaded to ${folderName}:`, file.name);
      addFileToFolder(folderName, file.name);
    }
  };

  // Function to handle URL submissions
  const handleUrlSubmit = (url, folderName) => {
    if (url && folderName) {
      console.log(`URL submitted to ${folderName}:`, url);
      addFileToFolder(folderName, `URL: ${url}`);
    }
  };

  // Function to add files/URLs to the appropriate folder
  const addFileToFolder = (folderName, fileOrUrl) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.name === folderName
          ? { ...folder, files: [...folder.files, fileOrUrl] }
          : folder
      )
    );
  };
  
  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar 
        setActivePage={setActivePage} 
        activePage={activePage} 
        folders={folders} 
        setFolders={setFolders}
      />

      {/* Conditional rendering based on active page */}
      
      {activePage === 'home' && (
        <HomePage 
          handleFileUpload={handleFileUpload} 
          handleUrlSubmit={handleUrlSubmit} 
          folders={folders} 
          
        />
      )}     
      {activePage === 'history' && <HistoryPage />}
      {activePage === 'favorite' && <FavoritePage />}
      {activePage === 'archive' && <ArchivePage />}
      {activePage === 'video' && <VideoPage setActivePage={setActivePage} />}
      {folders.find(folder => folder.name === activePage) && (
         /* Render Folder Page for the selected folder */
         <>
           {<FolderPage folder={folders.find(folder => folder.name === activePage)} />}
         </>
       )}
    </div>
  );
};

export default App;