import { Dispatch, SetStateAction } from 'react';
import { Player } from '../interfaces/Player.interface';

const SelectPlayer: React.FC<{
  setPlayer: Dispatch<SetStateAction<Player | null>>;
}> = ({ setPlayer }) => {
  const handleSelectPlayer = (e: string) => {
    const selectedPlayer: Player = { name: e };
    setPlayer(selectedPlayer);
  };

  const classes = [
    'Barbarian',
    'Bard',
    'Cleric',
    'Druid',
    'Fighter',
    'Monk',
    'Paladin',
    'Ranger',
    'Rogue',
    'Sorcerer',
    'Warlock',
    'Wizard',
  ];

  return (
    <>
      {classes.map((c) => {
        return <button onClick={() => handleSelectPlayer(c)}>{c}</button>;
      })}
    </>
  );
};

export default SelectPlayer;
