import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import Chat from './components/Chat';
import { usePlayerContext } from './lib/PlayerContext';
import SelectPlayer from './components/SelectPlayer';
import PlayerDetails from './components/PlayerDetails';
import styles from './App.module.css';
import { Player } from './interfaces/Player.interface';
import Players from './components/Players';
import PlayersOnline from './components/PlayersOnline';
import Rooms from './components/Rooms';
import Login from './components/Login';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

const LOGIN = 'login';
const PLAYERS = 'players';
const PLAYER_SELECT = 'playerselect';
const PLAYER_DETAILS = 'playerdetails';
const CHAT = 'chat';
const ROOMS = 'rooms';

// Extend the Socket interface
interface CustomSocket extends Socket {
  userID?: string;
}

const App: React.FC = () => {
  const { player, setPlayer, players, setPlayers, messages, setMessages } =
    usePlayerContext();
  const [socket, setSocket] = useState<CustomSocket | null>(null);
  const [activeComponent, setActiveComponent] = useState(LOGIN);
  const [allRooms, setAllRooms] = useState([]);
  const [room, setRoom] = useState();

  useEffect(() => {
    if (player) {
      const socket: CustomSocket = io(SERVER_URL, {
        withCredentials: true,
        auth: {
          name: player.name,
          sessionID: localStorage.getItem('sessionID'),
          userID: localStorage.getItem('userID'),
        },
      });

      socket.on('session', ({ sessionID, userID, name }) => {
        socket.auth = { sessionID, name };
        localStorage.setItem('sessionID', sessionID);
        localStorage.setItem('userID', userID);
        localStorage.setItem('name', name);
        socket.userID = userID;
      });

      socket.on('all rooms', (data) => {
        setAllRooms(data);
      });

      socket.on(
        'chat message',
        (data: { text: string; player: Player; room: string }) => {
          console.log('DATA:', data);
          console.log('TEXT', data.text);
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      );

      socket.on('chat history', ({ chatHistory }) => {
        console.log('chat history', chatHistory);
        setMessages(chatHistory);
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

  const sendMessage = (e: React.FormEvent<HTMLFormElement>, text: string) => {
    e.preventDefault();
    if (text.trim() !== '' && socket && player) {
      socket.emit('chat message', { text, player: player, room: room });
    }
  };

  const returnToPlayerSelect = () => {
    setActiveComponent(PLAYER_SELECT);
  };

  const returnToChat = () => {
    setMessages([]);
    setActiveComponent(CHAT);
  };

  const returnToRooms = () => {
    setActiveComponent(ROOMS);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case LOGIN:
        return <Login returnToPlayerSelect={returnToPlayerSelect} />;
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
          <Chat messages={messages} sendMessage={sendMessage} player={player} />
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
        return <Login returnToPlayerSelect={returnToPlayerSelect} />;
      // return (
      //   <SelectPlayer
      //     setPlayer={setPlayer}
      //     returnToChat={() => setActiveComponent(CHAT)}
      //     returnToRooms={() => setActiveComponent(ROOMS)}
      //   />
      // );
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
      </nav>
      {renderComponent()}
    </>
  );
};

export default App;
