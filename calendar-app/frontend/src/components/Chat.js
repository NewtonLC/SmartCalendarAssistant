import React, { useState } from 'react';

function Chat({ onMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onMessage(message);
    setMessage('');
  };

  return (
    <div>
      <h2>Chat with AI</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your event details..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;