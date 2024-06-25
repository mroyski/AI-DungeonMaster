import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import {
  Player,
  PlayerClass,
  playerClasses,
} from '../interfaces/Player.interface';
import styles from './SelectPlayer.module.css';

const SelectPlayer: React.FC<{
  setPlayer: Dispatch<SetStateAction<Player | null>>;
  returnToChat: any;
}> = ({ setPlayer, returnToChat }) => {
  const handleSelectPlayer = (e: PlayerClass) => {
    const selectedPlayer: Player = {
      name: e.name,
      playerClass: e,
    };
    setPlayer(selectedPlayer);
    returnToChat();
  };

  return (
    <div className={styles.selectPlayer}>
      {playerClasses.map((c) => (
        <div key={c.name} className={styles.playerOption}>
          <button
            className={styles.playerButton}
            onClick={() => handleSelectPlayer(c)}
          >
            {c.name}
          </button>
          <p className={styles.playerDescription}>{c.description}</p>
          <hr className={styles.hr} />
        </div>
      ))}
    </div>
  );
};

export default SelectPlayer;