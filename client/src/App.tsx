import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat';
import { usePlayerContext } from './lib/PlayerContext';
import SelectPlayer from './components/SelectPlayer';
import PlayerDetails from './components/PlayerDetails';
import styles from './App.module.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

const PLAYER_SELECT = 'playerselect';
const PLAYER_DETAILS = 'playerdetails';
const CHAT = 'chat';

const App: React.FC = () => {
  const { player, setPlayer, messages, setMessages } = usePlayerContext();
  const [socket, setSocket] = useState<any>(null);
  const [activeComponent, setActiveComponent] = useState(PLAYER_SELECT);

  useEffect(() => {
    if (player) {
      const socket = io(SERVER_URL, {
        withCredentials: true,
      });

      socket.on('connect', () => {
        console.log('Player connected to server', player);
        socket.emit('setPlayerName', player.name);
      });

      socket.on('chat message', (msg: string) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      socket.on('players', (players: any[]) => {
        console.log(players);
      });

      socket.on('player disconnected', (playerSocketId: string) => {
        console.log('Player disconnected', playerSocketId);
      });

      setSocket(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [player, setMessages]);

  const sendMessage = (
    e: React.FormEvent<HTMLFormElement>,
    message: string
  ) => {
    e.preventDefault();
    if (message.trim() !== '' && socket) {
      socket.emit('chat message', message);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case PLAYER_DETAILS:
        return <PlayerDetails player={player} />;
      case PLAYER_SELECT:
        return (
          <SelectPlayer
            setPlayer={setPlayer}
            returnToChat={() => setActiveComponent(CHAT)}
          />
        );
      case 'chat':
        return (
          <Chat messages={messages} sendMessage={sendMessage} player={player} />
        );
      default:
        return (
          <SelectPlayer
            setPlayer={setPlayer}
            returnToChat={() => setActiveComponent(CHAT)}
          />
        );
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <p>RPG</p>
        <button onClick={() => setActiveComponent(CHAT)}>Chat</button>
        <button onClick={() => setActiveComponent(PLAYER_DETAILS)}>
          Player Details
        </button>
        <button onClick={() => setActiveComponent(PLAYER_SELECT)}>
          Player Select
        </button>
      </nav>
      {renderComponent()}
    </>
  );
};

export default App;
