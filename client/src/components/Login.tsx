import styles from './Login.module.css';
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../lib/AuthContext';
import { useRenderComponent } from '../lib/RenderComponentContext';
import { RenderComponentName } from '../constants';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loggedIn } = useAuthContext();
  const { setActiveComponent } = useRenderComponent();

  useEffect(() => {
    if (loggedIn) {
      setActiveComponent(RenderComponentName.PLAYER_SELECT);
    }
  }, [loggedIn, setActiveComponent]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    let usernameInput = username.trim();
    let passwordInput = password.trim();

    if (!usernameInput.length || !passwordInput.length) return;

    login(usernameInput, passwordInput);
  };

  if (loggedIn) return null;

  return (
    <form className={styles.loginForm} onSubmit={submitHandler}>
      <label className={styles.loginLabel} htmlFor="username">Username</label>
      <input
        className={styles.loginInput}
        type="text"
        id="username"
        name="username"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label className={styles.loginLabel} htmlFor="password">Password</label>
      <input
        className={styles.loginInput}
        type="password"
        id="password"
        name="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className={styles.loginButton} type="submit">Login</button>
    </form>
  );
};

export default Login;
