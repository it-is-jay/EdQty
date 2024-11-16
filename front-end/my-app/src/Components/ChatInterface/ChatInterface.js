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

  const handleSummarize = async () => {
    try {
      // Send input to the API
      const response = await fetch("http://127.0.0.1:5000/api/summarize-transcript");

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
  };

  const handleTranslate = async () => {
    try {
      // Send input to the API
      const response = await fetch("http://127.0.0.1:5000/api/translate-transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "language": "chinese"}),
      });

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
  };
  const handleTimestamp = async () => {
    try {
      // Send input to the API
      const response = await fetch("http://127.0.0.1:5000/api/timestamp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "query": input}),
      });

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
  };
  const handleCaption = async () => {
    try {
      // Send input to the API
      const response = await fetch("http://127.0.0.1:5000/api/captioning", {
        method: "GET"
      });

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
  };
  const handleKeywords = async () => {
    try {
      // Send input to the API
      const response = await fetch("http://127.0.0.1:5000/api/keyword", {
        method: "GET"
      });

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
      <button onClick={handleSummarize} className="buttons">
          Summarize
      </button>
      <button onClick={handleTranslate} className="buttons">
          Translate
      </button>
      <button onClick={handleTimestamp} className="buttons">
          Timestamp
      </button>
      <button onClick={handleCaption} className="buttons">
          Caption
      </button>
      <button onClick={handleKeywords} className="buttons">
          Keywords
      </button>
       {/* <button onClick={handleTimestamp} className="buttons">
          Keywords
      </button>
      <button onClick={handleCaption} className="buttons">
          Find
      </button>
      <button className="buttons">
          Read it out
      </button> */}
      </div>
    </div>
  );
};

export default ChatInterface;
