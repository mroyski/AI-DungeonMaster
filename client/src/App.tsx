import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat';
import { usePlayerContext } from './lib/PlayerContext';
import SelectPlayer from './components/SelectPlayer';
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

const App: React.FC = () => {
  const { player, setPlayer, messages, setMessages } = usePlayerContext();
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
  }, [setMessages]);

  const sendMessage = (
    e: React.FormEvent<HTMLFormElement>,
    message: string
  ) => {
    e.preventDefault();
    if (message.trim() !== '' && socket) {
      socket.emit('chat message', message);
    }
  };

  if (!player) return <SelectPlayer setPlayer={setPlayer} />;

  return (
    <>
      <button onClick={() => setPlayer(null)}>Player Select</button>
      <Chat messages={messages} sendMessage={sendMessage} player={player} />
    </>
  );
};

export default App;
