import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

import { Player } from '../interfaces/Player.interface';
import { Message } from '../interfaces/Message.interface';

interface PlayerContextType {
  player: Player | null;
  setPlayer: Dispatch<SetStateAction<Player | null>>;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <PlayerContext.Provider
      value={{ player, setPlayer, messages, setMessages }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

const usePlayerContext = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};

export { PlayerProvider, usePlayerContext };
