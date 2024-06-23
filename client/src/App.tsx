import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');

  useEffect(() => {
    const io = require('socket.io-client');
    const socket = io('http://localhost:8080', {
      withCredentials: true,
    });

    socket.on('chat message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      const socket = io('http://localhost:8080');
      socket.emit('chat message', inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form id="form" onSubmit={sendMessage}>
        <input
          id="input"
          autoComplete="off"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;
