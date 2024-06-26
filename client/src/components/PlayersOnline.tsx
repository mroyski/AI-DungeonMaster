import React from 'react';
import { Player } from '../interfaces/Player.interface';
import styles from './PlayersOnline.module.css';

const PlayersOnline: React.FC<{ players: Player[] }> = ({ players }) => {
  const dotClass = players.length > 0 ? styles.green : styles.grey;

  return (
    <span>
      <span className={`${styles.dot} ${dotClass}`}></span>
      {players.length} online
    </span>
  );
};

export default PlayersOnline;
