import React, { useEffect, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import {
  Player,
  PlayerClass,
  playerClasses,
} from '../interfaces/Player.interface';
import styles from './SelectPlayer.module.css';
import { useAuthContext } from '../lib/AuthContext';

const images = require.context(
  '../assets/class-symbols',
  false,
  /\.(png|jpe?g|svg)$/
);

const serverURL = process.env.REACT_APP_SERVER_URL;

const SelectPlayer: React.FC<{
  setPlayer: Dispatch<SetStateAction<Player | null>>;
  returnToChat: () => void;
  returnToRooms: () => void;
}> = ({ setPlayer, returnToChat, returnToRooms }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      fetch(`${serverURL}/users/${user.id}/players`)
        .then((res) => res.json())
        .then((res) => setPlayers(res))
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);

  const handleSelectPlayer = (e: Player) => {
    setPlayer(e);
    returnToRooms();
  };

  return (
    <div className={styles.selectPlayer}>
      {players.map((c) => (
        <div key={c.name} className={styles.playerOption}>
          <img
            className={styles.symbol}
            src={images(`./${c.playerClass.symbol}`)}
            alt={c.name}
          />
          <button
            className={styles.playerButton}
            onClick={() => handleSelectPlayer(c)}
          >
            {c.name}
          </button>
          <p className={styles.playerDescription}>
            {c.playerClass.name}: {c.playerClass.description}
          </p>
          <hr className={styles.hr} />
        </div>
      ))}
    </div>
  );
};

export default SelectPlayer;
