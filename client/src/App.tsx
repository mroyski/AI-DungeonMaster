import React, { useState } from 'react';
import Chat from './components/Chat';
import { usePlayerContext } from './lib/PlayerContext';
import SelectPlayer from './components/SelectPlayer';
import PlayerDetails from './components/PlayerDetails';
import styles from './App.module.css';
import Players from './components/Players';
import PlayersOnline from './components/PlayersOnline';
import Rooms from './components/Rooms';
import Login from './components/Login';
import { useAuthContext } from './lib/AuthContext';
import { useSocketContext } from './lib/SocketContext';


const LOGIN = 'login';
const PLAYERS = 'players';
const PLAYER_SELECT = 'playerselect';
const PLAYER_DETAILS = 'playerdetails';
const CHAT = 'chat';
const ROOMS = 'rooms';

const App: React.FC = () => {
  const { player, setPlayer, players, setPlayers, messages, setMessages } =
    usePlayerContext();
  const { loggedIn, logout } = useAuthContext();

  const { socket, allRooms, setRoom, room } = useSocketContext();
  const [activeComponent, setActiveComponent] = useState(PLAYER_SELECT);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>, text: string) => {
    e.preventDefault();
    if (text.trim() !== '' && socket && player) {
      socket.emit('chat message', { text, player: player, room: room });
    }
  };

  const returnToChat = () => {
    setMessages([]);
    setActiveComponent(CHAT);
  };

  const returnToRooms = () => {
    setActiveComponent(ROOMS);
  };

  const logoutHandler = () => {
    setActiveComponent(PLAYER_SELECT);
    logout();
  }

  const renderComponent = () => {
    if (!loggedIn) return <Login />;

    switch (activeComponent) {
      case LOGIN:
        return <Login />;
      case PLAYER_DETAILS:
        return <PlayerDetails player={player} />;
      case PLAYER_SELECT:
        return (
          <SelectPlayer
            setPlayer={setPlayer}
            returnToChat={returnToChat}
            returnToRooms={returnToRooms}
          />
        );
      case CHAT:
        return (
          <Chat
            messages={messages}
            sendMessage={sendMessage}
            player={player}
            roomSelected={!!room}
          />
        );
      case PLAYERS:
        return <Players players={players} />;
      case ROOMS:
        return (
          <Rooms
            socket={socket}
            player={player}
            setRoom={setRoom}
            currentRoom={room}
            allRooms={allRooms}
            returnToChat={returnToChat}
          />
        );
      default:
        return (
          <SelectPlayer
            setPlayer={setPlayer}
            returnToChat={returnToChat}
            returnToRooms={returnToRooms}
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
        <button onClick={() => setActiveComponent(ROOMS)}>Rooms</button>
        <button onClick={logoutHandler}>Log Out</button>
      </nav>
      {renderComponent()}
    </>
  );
};

export default App;
