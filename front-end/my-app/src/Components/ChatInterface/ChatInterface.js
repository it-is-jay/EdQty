import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isBot: false }]);
      setInput("");

      // Simulate bot response
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: "This is a simulated response.", isBot: true }
        ]);
      }, 1000);
    }
  };

  return (
    <div className="chat-container">
      {/* Message display area */}
      <div className="message-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.isBot ? "bot-message" : "user-message"}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Input area */}
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          className="input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
