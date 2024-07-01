const rooms = ['1', '2', '3'];

const Rooms: React.FC<{
  socket: any;
  player: any;
  currentRoom: any;
  setRoom: any;
}> = ({ socket, player, currentRoom, setRoom }) => {
  const joinRoom = (room: string) => {
    if (currentRoom)
      socket.emit('leave room', { room: currentRoom, name: player.name });

    socket.emit('join room', {
      room,
      name: player.name,
      userID: player.userID,
    });
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
