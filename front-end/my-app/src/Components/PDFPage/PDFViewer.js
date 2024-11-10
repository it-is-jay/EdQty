import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import './PDFViewer.css';
import ChatInterface from '../ChatInterface/ChatInterface';

const PDFViewer = () => {
  return (
    <div className="pdf-viewer-container">
      <div style={{flex:1, width: '100%', height: '100vh' }}>
        <iframe
          src={"https://docs.ufpr.br/~danielsantos/ProbabilisticRobotics.pdf"}
          width="800px"
          height="100%"
          title="PDF Viewer"
          style={{ border: 'none' }}
        ></iframe>
      </div>
      <div className="chat-section">
        <ChatInterface />
      </div>
    </div>
  );
};
export default PDFViewer;
