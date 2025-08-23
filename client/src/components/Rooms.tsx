import React, { useState } from 'react';
import { usePlayerContext } from '../lib/PlayerContext';
import { useSocketContext } from '../lib/SocketContext';
import { useRenderComponent } from '../lib/RenderComponentContext';
import { RenderComponentName } from '../constants';
import styles from './Rooms.module.css';
import CreateRoomModal from './CreateRoomModal';
import JoinRoomModal from './JoinRoomModal';

const Rooms: React.FC = () => {
  const { setActiveComponent } = useRenderComponent();
  const { socket, room, setRoom, allRooms } = useSocketContext();
  const { player, setMessages } = usePlayerContext();

  const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);

  const joinRoom = (roomToJoin: any) => {
    if (roomToJoin?.id === room?.id) {
      setActiveComponent(RenderComponentName.CHAT);
      return;
    }

    if (room) {
      socket?.emit('leave room', { room, name: player?.name });
    }

    socket?.emit('join room', {
      room: roomToJoin.id,
      player: player,
    });
    setMessages([]);
    setRoom(roomToJoin);
    setActiveComponent(RenderComponentName.CHAT);
    setJoinRoomModalOpen(false);
  };

  const handleRoomCreated = () => {
    console.log('Room created successfully');
  };

  const openJoinRoomModal = (room: any) => {
    setSelectedRoom(room);
    setJoinRoomModalOpen(true);
  };

  const closeModal = () => {
    setJoinRoomModalOpen(false);
    setSelectedRoom(null);
  };

  if (!player) return <p>Select Player</p>;

  if (!allRooms.length) return <p>No available Rooms</p>;

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <h1>Rooms</h1>
        
        <div className={styles.createRoomContainer}>
          <button 
            className={styles.createRoomButton}
            onClick={() => setCreateRoomModalOpen(true)}
          >
            Create New Room
          </button>
        </div>
        
        {allRooms.map((r) => (
          <div key={r.id} className={styles.roomContainer}>
            <div className={styles.roomInfo}>
              <strong>{r.name}</strong>
              {r.owner && <small> (Owner: {r.owner})</small>}
            </div>
            <button 
              className={styles.joinButton}
              onClick={() => openJoinRoomModal(r)}
            >
              Join Room
            </button>
          </div>
        ))}

        <CreateRoomModal
          isOpen={createRoomModalOpen}
          onClose={() => setCreateRoomModalOpen(false)}
          onRoomCreated={handleRoomCreated}
        />
        
        <JoinRoomModal
          isOpen={joinRoomModalOpen}
          room={selectedRoom}
          onConfirm={() => joinRoom(selectedRoom)}
          onCancel={closeModal}
        />
      </div>
    </div>
  );
};

export default Rooms;
