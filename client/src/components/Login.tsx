import React, { useState } from 'react';
import { useAuthContext } from '../lib/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setLoggedIn } = useAuthContext();

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    let emailInput = email.trim();
    let passwordInput = password.trim();

    if (!emailInput.length || !passwordInput.length) return;

    setLoggedIn(true);

    // loginHandler({ emailInput, passwordInput });
    // returnToPlayerSelect();
    // clearForm();
  };

  //   const clearForm = () => {
  //     setEmail('');
  //     setPassword('');
  //   };

  return (
    <form>
      <input
        type="text"
        name="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
