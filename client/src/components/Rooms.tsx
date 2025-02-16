import { usePlayerContext } from '../lib/PlayerContext';
import { useSocketContext } from '../lib/SocketContext';
import { useRenderComponent } from '../lib/RenderComponentContext';
import { RenderComponentName } from '../constants';

const Rooms: React.FC = () => {
  const { setActiveComponent } = useRenderComponent();
  const { socket, setRoom, allRooms } = useSocketContext();
  const { player, setMessages } = usePlayerContext();

  const joinRoom = (room: string) => {
    if (room) socket?.emit('leave room', { room, name: player?.name });

    socket?.emit('join room', {
      room,
      player: player,
    });
    setMessages([]);
    setRoom(room);
    setActiveComponent(RenderComponentName.CHAT);
  };

  if (!player) return <p>Select Player</p>;

  if (!allRooms.length) return <p>No available Rooms</p>;

  return (
    <div>
      {allRooms.map((r) => (
        <div key={r.id}>
          <div>{r.name}</div>
          <button key={r.id} onClick={() => joinRoom(r.id)}>
            Join Room {r.id}
          </button>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Rooms;
