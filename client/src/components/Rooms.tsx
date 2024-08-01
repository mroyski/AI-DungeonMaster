interface Room {
  id: string;
  name: string;
}

const Rooms: React.FC<{
  socket: any;
  player: any;
  currentRoom: any;
  setRoom: any;
  allRooms: Room[];
  returnToChat: any;
}> = ({ socket, player, currentRoom, setRoom, allRooms, returnToChat }) => {
  const joinRoom = (room: string) => {
    if (currentRoom)
      socket.emit('leave room', { room: currentRoom, name: player.name });

    socket.emit('join room', {
      room,
      player: player,
      userID: player.userID,
    });
    setRoom(room);
    returnToChat();
  };

  if (!player) return <p>Select Player</p>;

  if (!allRooms) return <p>No available Rooms</p>;

  return (
    <div>
      {allRooms.map((r) => (
        <>
          <div>{r.name}</div>
          <button key={r.id} onClick={() => joinRoom(r.id)}>
            Join Room {r.id}
          </button>
          <hr />
        </>
      ))}
    </div>
  );
};

export default Rooms;
