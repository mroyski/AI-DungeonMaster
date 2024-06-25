import React, { useState } from 'react';
import styles from './Chat.module.css';

interface Props {
  messages: Array<string>;
  sendMessage: (e: React.FormEvent<HTMLFormElement>, message: string) => void;
}

const Chat: React.FC<Props> = ({ messages, sendMessage }) => {
  const [inputMessage, setInputMessage] = useState<string>('');

  const sendMessageHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(e, inputMessage);
    setInputMessage('');
  };

  return (
    <div>
      <ul className={styles.messages}>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form className={styles.form} onSubmit={sendMessageHandler}>
        <input
          className={styles.input}
          autoComplete="off"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
