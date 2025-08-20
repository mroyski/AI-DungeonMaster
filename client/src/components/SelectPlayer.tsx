import React, { useEffect, useState } from 'react';
import { Player } from '../interfaces/Player.interface';
import styles from './SelectPlayer.module.css';
import { useAuthContext } from '../lib/AuthContext';
import { usePlayerContext } from '../lib/PlayerContext';
import { useRenderComponent } from '../lib/RenderComponentContext';
import { RenderComponentName } from '../constants';
import { useSocketContext } from '../lib/SocketContext';

const images = require.context(
  '../assets/class-symbols',
  false,
  /\.(png|jpe?g|svg)$/
);

const serverURL = process.env.REACT_APP_SERVER_URL;

const SelectPlayer: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const { user, loggedIn } = useAuthContext();
  const { setPlayer } = usePlayerContext();
  const { setActiveComponent } = useRenderComponent();
  const { setRoom } = useSocketContext();

  useEffect(() => {
    if (user && loggedIn) {
      fetch(`${serverURL}/users/${user.id}/players`)
        .then((res) => res.json())
        .then((res) => setPlayers(res.data))
        .then((res) => console.log(res))
        .catch((error) => {
          console.log(error);
        });
    } else {
      setPlayers([]);
    }
  }, [user, loggedIn]);

  const handleSelectPlayer = (e: Player) => {
    setRoom(null);
    console.log(e);
    setPlayer(e);
    setActiveComponent(RenderComponentName.ROOMS);
  };

  return (
    <div className={styles.selectPlayer}>
      {players.map((p) => (
        <div key={p.name} className={styles.playerOption}>
          <img
            className={styles.symbol}
            src={images(`./${p.playerClass.symbol}`)}
            alt={p.name}
          />
          <button
            className={styles.playerButton}
            onClick={() => handleSelectPlayer(p)}
          >
            {p.name}
          </button>
          <p className={styles.playerDescription}>
            {p.playerClass.name}: {p.playerClass.description}
          </p>
          <hr className={styles.hr} />
        </div>
      ))}
    </div>
  );
};

export default SelectPlayer;
