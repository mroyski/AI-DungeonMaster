import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat';
import { usePlayerContext } from './lib/PlayerContext';
import SelectPlayer from './components/SelectPlayer';
import PlayerDetails from './components/PlayerDetails';
import styles from './App.module.css';
import { Player } from './interfaces/Player.interface';
import Players from './components/Players';
import PlayersOnline from './components/PlayersOnline';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

const PLAYERS = 'players';
const PLAYER_SELECT = 'playerselect';
const PLAYER_DETAILS = 'playerdetails';
const CHAT = 'chat';

const App: React.FC = () => {
  const { player, setPlayer, players, setPlayers, messages, setMessages } =
    usePlayerContext();
  const [socket, setSocket] = useState<any>(null);
  const [activeComponent, setActiveComponent] = useState(PLAYER_SELECT);

  useEffect(() => {
    if (player) {
      const socket = io(SERVER_URL, {
        withCredentials: true,
        auth: { name: player.name },
      });

      socket.on('chat message', (data: { message: string; sender: string }) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on('players', (players: any[]) => {
        console.log('players: ', players);
        const otherPlayers = players.filter((p) => p.id !== socket.id);
        setPlayers(otherPlayers);
      });

      socket.on('player disconnected', (playerSocketId: string) => {
        console.log('Player disconnected', playerSocketId);
      });

      setSocket(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [player, setMessages, setPlayers]);

  const sendMessage = (
    e: React.FormEvent<HTMLFormElement>,
    message: string
  ) => {
    e.preventDefault();
    if (message.trim() !== '' && socket && player) {
      socket.emit('chat message', { message, sender: player.name });
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
      case 'players':
        return <Players players={players} />;
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
        <button onClick={() => setActiveComponent(PLAYERS)}>
          <PlayersOnline players={players} />
        </button>
        <button onClick={() => setActiveComponent(CHAT)}>Chat</button>
        <button onClick={() => setActiveComponent(PLAYER_DETAILS)}>
          Player
        </button>
        <button onClick={() => setActiveComponent(PLAYER_SELECT)}>
          Select
        </button>
      </nav>
      {renderComponent()}
    </>
  );
};

export default App;
