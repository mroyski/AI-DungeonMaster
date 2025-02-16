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
    <form>
      <input
        type="text"
        name="username"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input type="submit" value="submit" onClick={submitHandler} />
    </form>
  );
};

export default Login;
