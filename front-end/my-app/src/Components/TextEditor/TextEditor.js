// TextEditor.js
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const TextEditor = ({ value, onChange }) => {
  return (
    <div className="text-editor-container">
      <ReactQuill
        value={value}
        onChange={onChange}
        theme="snow"
        placeholder="Start writing here..."
      />
    </div>
  );
};

export default TextEditor;
