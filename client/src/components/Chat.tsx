import React, { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import { useSocketContext } from '../lib/SocketContext';
import { usePlayerContext } from '../lib/PlayerContext';

const Chat: React.FC = () => {
  const { sendMessage, room } = useSocketContext();
  const { player, messages } = usePlayerContext();
  const [inputMessage, setInputMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(e, inputMessage);
    setInputMessage('');
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!player) return <p className={styles.error}>Please select a player!</p>;
  if (!room) return <p className={styles.error}>Please select a room!</p>;

  return (
    <div className={styles.chatContainer}>
      <div className={styles.playerInfo}>
        <p>You are playing as {player.name}</p>
      </div>
      <div className={styles.messagesContainer}>
        <ul className={styles.messages}>
          {messages.map((msg, index) => {
            const messageFrom = msg.fromDungeonMaster ? 'DM' : msg.player.name;
            return (
              <li
                key={index}
                className={
                  index % 2 === 0 ? styles.messageOdd : styles.messageEven
                }
              >
                {messageFrom}: {msg.text}
              </li>
            );
          })}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <form className={styles.form} onSubmit={sendMessageHandler}>
        <input
          className={styles.input}
          autoComplete="off"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit" className={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
