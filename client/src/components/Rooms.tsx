const rooms = ['1', '2', '3'];

const Rooms: React.FC<{ socket: any; player: any; setRoom: any }> = ({
  socket,
  player,
  setRoom,
}) => {
  const joinRoom = (room: string) => {
    socket.emit('join room', { room, name: player.name });
    setRoom(room);
  };

  if (!player) return <p>Select Player</p>;

  return (
    <div>
      {rooms.map((r) => (
        <button key={r} onClick={() => joinRoom(r)}>
          Join Room {r}
        </button>
      ))}
    </div>
  );
};

export default Rooms;
