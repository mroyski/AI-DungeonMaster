import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

interface AuthContextType {
  loggedIn: Boolean;
  setLoggedIn: Dispatch<SetStateAction<Boolean>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<Boolean>(false);

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
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
