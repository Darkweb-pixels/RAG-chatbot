import React from 'react';
import './Message.css';

const Message = ({ content, sender, isError }) => {
  const messageClass = sender === 'user' ? 'user-message' : 'bot-message';
  const errorClass = isError ? 'error-message' : '';
  
  return (
    <div className={`message ${messageClass} ${errorClass}`}>
      <div className="message-avatar">
        {sender === 'user' ? (
          <span className="avatar-icon user-icon">👤</span>
        ) : (
          <span className="avatar-icon bot-icon">🤖</span>
        )}
      </div>
      <div className="message-content">
        {content.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i !== content.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Message; 