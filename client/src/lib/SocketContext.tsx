import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { usePlayerContext } from './PlayerContext';
import { useAuthContext } from './AuthContext';
import { Message } from '../interfaces/Message.interface';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

// Extend the Socket interface
interface CustomSocket extends Socket {
  userID?: string;
}

interface SocketContextType {
  socket: CustomSocket | null;
  allRooms: any[];
  setRoom: React.Dispatch<React.SetStateAction<any>>;
  room: any;
  sendMessage: (e: React.FormEvent<HTMLFormElement>, text: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { player, setPlayers, setMessages } = usePlayerContext();
  const { loggedIn } = useAuthContext();
  const [socket, setSocket] = useState<CustomSocket | null>(null);
  const [allRooms, setAllRooms] = useState([]);
  const [room, setRoom] = useState();

  const sendMessage = (e: React.FormEvent<HTMLFormElement>, text: string) => {
    e.preventDefault();
    if (text.trim() !== '' && socket && player) {
      socket.emit('chat message', { text, player: player, room: room });
    }
  };

  useEffect(() => {
    if (!player || !loggedIn) {
      socket?.disconnect();
    } else if (player && loggedIn) {
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

      socket.on('chat message', (data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on('chat history', ({ chatHistory }) => {
        setMessages(chatHistory);
      });

      socket.on('players', (players: any[]) => {
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
  }, [player, setMessages, setPlayers, loggedIn]);

  return (
    <SocketContext.Provider
      value={{ socket, allRooms, setRoom, room, sendMessage }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};
