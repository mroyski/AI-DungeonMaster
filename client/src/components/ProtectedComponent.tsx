import React from 'react';
import Login from './Login';
import { usePlayerContext } from '../lib/PlayerContext';

const ProtectedComponent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { loggedIn } = usePlayerContext();

  if (!loggedIn) return <Login />;
  return <>{children}</>;
};

export default ProtectedComponent;
