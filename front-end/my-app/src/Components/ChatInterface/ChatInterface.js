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

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isBot: false }]);
      setInput("");

      try {
        // Send input to the API
        const response = await fetch("http://127.0.0.1:5000/api/db-query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ "query": input }),
        });

        // Check if the response is ok
        if (response.ok) {
          const data = await response.json();
          // Assuming the response has a 'response' field
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.message, isBot: true },
          ]);
        } else {
          throw new Error("Failed to fetch response from the server.");
        }
      } catch (error) {
        // Handle error
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Sorry, there was an error. Please try again.", isBot: true },
        ]);
      }
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
      <div>
      <button className="buttons">
          Summarize
      </button>
      <button className="buttons">
          Translate
      </button>
      <button className="buttons">
          Translate
      </button>
      <button className="buttons">
          Translate
      </button>
      <button className="buttons">
          Translate
      </button>
      </div>
    </div>
  );
};

export default ChatInterface;
