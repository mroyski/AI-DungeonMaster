import React from 'react';
import styles from './PlayerDetails.module.css';
import { usePlayerContext } from '../lib/PlayerContext';
import { useRenderComponent } from '../lib/RenderComponentContext';
import { RenderComponentName } from '../constants';

const PlayerDetails: React.FC = () => {
  const { player } = usePlayerContext();
  const { setActiveComponent } = useRenderComponent();

  return (
    <>
      {player ? (
        <div className={styles.playerDetails}>
          <h2 className={styles.playerName}>{player.name}</h2>
          <p className={styles.playerDescription}>
            <strong>Description:</strong> {player.playerClass.description}
          </p>
          <p className={styles.primaryAbility}>
            <strong>Primary Ability: </strong>
            {player.playerClass.primaryAbility}
          </p>
        </div>
      ) : (
        <p className={styles.error}>Please select a player!</p>
      )}
      <button
        onClick={() => setActiveComponent(RenderComponentName.PLAYER_SELECT)}
      >
        Player Select
      </button>
    </>
  );
};

export default PlayerDetails;
