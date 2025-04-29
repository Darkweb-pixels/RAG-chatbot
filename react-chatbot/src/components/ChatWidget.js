import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatWidget.css';

const ChatWidget = ({ apiKey }) => {
  const [messages, setMessages] = useState([
    {
      content: "How can I help you today?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      content: input,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await axios.post('/chat', {
        message: input,
        api_key: apiKey
      });
      
      const botMessage = {
        content: response.data.response,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        content: `Sorry, there was an error: ${error.response?.data?.detail || error.message || 'Unknown error'}`,
        sender: 'bot',
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Button (Visible when widget is closed) */}
      {!isOpen && (
        <div className="chat-widget-fixed-button" onClick={toggleWidget}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM13 11H11V5H13V11ZM13 15H11V13H13V15Z" fill="white"/>
          </svg>
        </div>
      )}
      
      {/* Close Button (Visible when widget is open) */}
      {isOpen && (
        <div className="chat-widget-toggle-outside" onClick={toggleWidget}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="white"/>
          </svg>
        </div>
      )}
      
      {/* Main Chat Widget */}
      <div className={`chat-widget ${isOpen ? 'open' : 'closed'}`}>
        {isOpen && (
          <>
            <div className="chat-widget-header">
              Chat with AI Assistant
            </div>
            <div className="chat-widget-messages">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`chat-widget-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="chat-widget-message-content">
                    {message.sender === 'bot' 
                      ? message.content.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line.trim().startsWith('•') || line.trim().startsWith('-') || /^\d+[.)]/.test(line.trim()) 
                              ? <div className="point-item">{line}</div> 
                              : line
                            }
                            {i !== message.content.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))
                      : message.content
                    }
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="chat-widget-message bot-message">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            <form className="chat-widget-input" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default ChatWidget; 