import React from 'react';
import Login from './Login';
import { useAuthContext } from '../lib/AuthContext';

// protected component strategy sounds good but not implemented yet
const ProtectedComponent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { loggedIn } = useAuthContext();

  if (!loggedIn) return <Login />;
  return <>{children}</>;
};

export default ProtectedComponent;
