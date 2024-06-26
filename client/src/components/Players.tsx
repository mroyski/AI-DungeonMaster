import { Player } from '../interfaces/Player.interface';

const Players: React.FC<{ players: Player[] }> = ({ players }) => {
  if (!players) return null;
  return (
    <ul>
      {players.map((f) => {
        return <li key={f.name}>{f.name}</li>;
      })}
    </ul>
  );
};

export default Players;
