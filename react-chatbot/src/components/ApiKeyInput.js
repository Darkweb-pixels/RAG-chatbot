import React, { useState } from 'react';
import './ApiKeyInput.css';

const ApiKeyInput = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setIsError(true);
      return;
    }
    setIsError(false);
    onSubmit(apiKey);
  };

  return (
    <div className="api-key-container">
      <div className="api-key-card">
        <h2>Enter Your Groq API Key</h2>
        <p>To start chatting with your documents, please enter your Groq API key.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="api-key">API Key:</label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Groq API key"
              className={isError ? 'error' : ''}
            />
            {isError && <p className="error-message">Please enter a valid API key</p>}
          </div>
          
          <button type="submit" className="submit-button">
            Start Chatting
          </button>
        </form>
        
        <div className="info-box">
          <h3>Don't have a Groq API key?</h3>
          <p>You can get one by signing up at <a href="https://console.groq.com/signup" target="_blank" rel="noopener noreferrer">Groq Console</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput; 