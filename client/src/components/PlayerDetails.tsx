import React from 'react';
import { Player } from '../interfaces/Player.interface';
import styles from './PlayerDetails.module.css'; // Import CSS module for styling

const PlayerDetails: React.FC<{ player: Player | null }> = ({ player }) => {
  if (!player) return <p className={styles.error}>Please select a player!</p>;

  return (
    <div className={styles.playerDetails}>
      <h2 className={styles.playerName}>{player.name}</h2>
      <p className={styles.playerDescription}>
        <strong>Description:</strong> {player.playerClass.description}
      </p>
      <p className={styles.primaryAbility}>
        <strong>Primary Ability:</strong> {player.playerClass.primaryAbility}
      </p>
    </div>
  );
};

export default PlayerDetails;
