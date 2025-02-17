import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { RenderComponentName } from '../constants';
import { useAuthContext } from './AuthContext';
import { usePlayerContext } from './PlayerContext';

type RenderComponentContextType = {
  activeComponent: RenderComponentName;
  setActiveComponent: (component: RenderComponentName) => void;
};

const RenderComponentContext = createContext<
  RenderComponentContextType | undefined
>(undefined);

export const RenderComponentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { loggedIn } = useAuthContext();
  const [activeComponent, setActiveComponent] = useState(
    RenderComponentName.PLAYER_SELECT
  );
  const { player } = usePlayerContext();

  useEffect(() => {
    if (!loggedIn) {
      setActiveComponent(RenderComponentName.LOGIN);
    }
  }, [loggedIn, player, activeComponent]);

  return (
    <RenderComponentContext.Provider
      value={{ activeComponent, setActiveComponent }}
    >
      {children}
    </RenderComponentContext.Provider>
  );
};

export const useRenderComponent = () => {
  const context = useContext(RenderComponentContext);
  if (!context) {
    throw new Error(
      'useRenderComponent must be used within a RenderComponentProvider'
    );
  }
  return context;
};
