import React from 'react';
import './App.css';
import ChatWidget from './components/ChatWidget';

function App() {
  // Using the saved API key directly (now stored in backend)
  return (
    <div className="App">
      <ChatWidget apiKey="" />
    </div>
  );
}

export default App; 