import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import './TextViewer.css';
import ChatInterface from '../ChatInterface/ChatInterface';

const PDFViewer = () => {
  return (
    <div className="pdf-viewer-container">
        <div style={{ flex: 1, width: '100%', height: '100vh', overflow: 'auto' }}>
        <pre
    style={{
      whiteSpace: 'pre-wrap',   // Wrap long lines
      wordBreak: 'break-word',  // Ensure words break and don't overflow
      padding: '20px',
      backgroundColor: '#f4f4f4', // Light background for snippet
      borderRadius: '10px',    // Rounded corners
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for emphasis
      fontSize: '16px',        // Adjust font size for better readability
      fontFamily: 'monospace', // Monospaced font for code-like appearance
    }}
  >
    {`Quantum computing is a revolutionary area of computing that leverages the principles of quantum mechanics to process information in fundamentally new ways. Unlike classical computing, which relies on bits to represent information as either 0 or 1, quantum computing uses quantum bits, or qubits. These qubits can exist in multiple states simultaneously, thanks to the phenomenon known as superposition.

    This ability to represent multiple states at once allows quantum computers to perform certain types of calculations much faster than classical computers. One of the most well-known algorithms that take advantage of quantum computing is Shor's algorithm, which can factor large numbers exponentially faster than the best-known classical algorithms. This could have major implications for fields like cryptography and data security.

    Quantum computing is still in its early stages of development, and many technical challenges remain. Quantum decoherence, for instance, refers to the loss of quantum coherence, which causes qubits to lose their superposition and behave more like classical bits. To address this, researchers are working on quantum error correction techniques and building more stable qubits.

    Despite these challenges, quantum computing holds the potential to solve problems that are currently intractable for classical computers, such as simulating molecular structures for drug discovery, optimizing supply chains, or solving complex machine learning tasks. As the field progresses, we are likely to see a new era of computing that can unlock capabilities far beyond what we can imagine today.`}
  </pre>
        </div>

        <ChatInterface />
      </div>
  );
};
export default PDFViewer;
