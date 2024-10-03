import React from 'react';
import Login from './Login';
import { useAuthContext } from '../lib/AuthContext';

const ProtectedComponent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { loggedIn } = useAuthContext();

  if (!loggedIn) return <Login />;
  return <>{children}</>;
};

export default ProtectedComponent;
