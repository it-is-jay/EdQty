import React from 'react';
import ChatInterface from './../ChatInterface/ChatInterface';
import './VideoViewer.css'
const YouTubeEmbed = ({ videoId, width = "700", height = "394" }) => {
  const embedUrl = 'https://www.youtube.com/embed/2IK3DFHRFfw'; // Replace with your video ID

  return (
    <div>
    <div className="container">
      
      <div className="youtube-embed">
        <iframe
          width={width}
          height={height}
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="chat-section">
        <ChatInterface />
      </div>
    </div>
    </div>
  );
};

export default YouTubeEmbed;
