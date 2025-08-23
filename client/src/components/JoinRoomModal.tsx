import React from 'react';
import styles from './JoinRoomModal.module.css';

interface JoinRoomModalProps {
  isOpen: boolean;
  room: any;
  onConfirm: () => void;
  onCancel: () => void;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  isOpen,
  room,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !room) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <p className={styles.modalText}>
          Do you want to join room {room.name}?
        </p>
        <button
          className={`${styles.button} ${styles.confirmButton}`}
          onClick={onConfirm}
        >
          Yes
        </button>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default JoinRoomModal;