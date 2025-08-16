import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  loggedIn: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  user: UserData | null;
}

interface UserData {
  id: string;
  username: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const serverURL = process.env.REACT_APP_SERVER_URL;

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);

  const login = async (username: string, password: string) => {
    const loginOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    };

    const response = await fetch(`${serverURL}/auth/login`, loginOptions);
    if (response.ok) {
      const result = await response.json();
      const userData = result.data;
      setUser({ id: userData.id, username: userData.username });
      setLoggedIn(true);
    }
  };

  const logout = () => {
    setUser(null);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        login,
        logout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuthContext };
