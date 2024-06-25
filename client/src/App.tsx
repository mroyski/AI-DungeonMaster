import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import Chat from './components/Chat';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on('chat message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (
    e: React.FormEvent<HTMLFormElement>,
    message: string
  ) => {
    e.preventDefault();
    if (message.trim() !== '' && socket) {
      socket.emit('chat message', message);
    }
  };

  return (
    <>
      <Chat messages={messages} sendMessage={sendMessage} />
    </>
  );
};

export default App;
