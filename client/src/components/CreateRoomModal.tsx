import React, { useState } from 'react';
import { usePlayerContext } from '../lib/PlayerContext';
import styles from './CreateRoomModal.module.css';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: (room: any) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onRoomCreated,
}) => {
  const [roomName, setRoomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { player } = usePlayerContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName.trim()) {
      setError('Room name is required');
      return;
    }

    if (!player) {
      setError('Please select a player first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/rooms`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: roomName.trim(),
            playerId: player._id,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        onRoomCreated(result.data);
        setRoomName('');
        onClose();
      } else {
        setError(result.message || 'Failed to create room');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>Create New Room</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="roomName">Room Name:</label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name..."
              maxLength={50}
              disabled={isLoading}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              disabled={isLoading || !roomName.trim()}
              className={styles.createButton}
            >
              {isLoading ? 'Creating...' : 'Create Room'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
