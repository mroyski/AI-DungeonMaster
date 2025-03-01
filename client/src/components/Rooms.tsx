import React, { useState } from 'react';
import { usePlayerContext } from '../lib/PlayerContext';
import { useSocketContext } from '../lib/SocketContext';
import { useRenderComponent } from '../lib/RenderComponentContext';
import { RenderComponentName } from '../constants';
import styles from './Rooms.module.css';

const Rooms: React.FC = () => {
  const { setActiveComponent } = useRenderComponent();
  const { socket, room, setRoom, allRooms } = useSocketContext();
  const { player, setMessages } = usePlayerContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

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
    setModalOpen(false);
  };

  const openJoinRoomModal = (room: any) => {
    setSelectedRoom(room);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRoom(null);
  };

  if (!player) return <p>Select Player</p>;

  if (!allRooms.length) return <p>No available Rooms</p>;

  return (
    <div>
      {allRooms.map((r) => (
        <div key={r.id}>
          <div>{r.name}</div>
          <button onClick={() => openJoinRoomModal(r)}>
            Join Room {r.id}
          </button>
          <hr />
        </div>
      ))}

      {modalOpen && selectedRoom && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p className={styles.modalText}>Do you want to join room {selectedRoom.name}?</p>
            <button className={`${styles.button} ${styles.confirmButton}`} onClick={() => joinRoom(selectedRoom)}>
              Yes
            </button>
            <button className={`${styles.button} ${styles.cancelButton}`} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
