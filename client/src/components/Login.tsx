import React, { useState } from 'react';

const Login: React.FC<{ returnToPlayerSelect: () => void }> = ({
  returnToPlayerSelect,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    let emailInput = email.trim();
    let passwordInput = password.trim();

    if (!emailInput.length || !passwordInput.length) return;

    // loginHandler({ emailInput, passwordInput });
    returnToPlayerSelect();
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
