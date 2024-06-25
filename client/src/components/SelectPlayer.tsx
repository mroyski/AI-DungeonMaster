import { Dispatch, SetStateAction } from 'react';
import {
  Player,
  PlayerClass,
  playerClasses,
} from '../interfaces/Player.interface';

const SelectPlayer: React.FC<{
  setPlayer: Dispatch<SetStateAction<Player | null>>;
}> = ({ setPlayer }) => {
  const handleSelectPlayer = (e: PlayerClass) => {
    const selectedPlayer: Player = {
      name: e.name,
      playerClass: e,
    };
    setPlayer(selectedPlayer);
  };

  return (
    <>
      {playerClasses.map((c) => {
        return (
          <>
            <button onClick={() => handleSelectPlayer(c)}>{c.name}</button>
            <p>{c.description}</p>
            <hr />
          </>
        );
      })}
    </>
  );
};

export default SelectPlayer;
