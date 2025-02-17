import React from 'react';
import Chat from './components/Chat';
import { usePlayerContext } from './lib/PlayerContext';
import SelectPlayer from './components/SelectPlayer';
import PlayerDetails from './components/PlayerDetails';
import styles from './App.module.css';
import Players from './components/Players';
import PlayersOnline from './components/PlayersOnline';
import Rooms from './components/Rooms';
import Login from './components/Login';
import { useAuthContext } from './lib/AuthContext';
import { useSocketContext } from './lib/SocketContext';
import { useRenderComponent } from './lib/RenderComponentContext';
import { RenderComponentName } from './constants';
import CreatePlayer from './components/CreatePlayer';

const App: React.FC = () => {
  const { player, players, messages } = usePlayerContext();
  const { logout } = useAuthContext();
  const { room } = useSocketContext();
  const { activeComponent, setActiveComponent } = useRenderComponent();

  const logoutHandler = () => {
    setActiveComponent(RenderComponentName.PLAYER_SELECT);
    logout();
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case RenderComponentName.LOGIN:
        return <Login />;
      case RenderComponentName.PLAYER_DETAILS:
        return <PlayerDetails />;
      case RenderComponentName.PLAYER_SELECT:
        return <SelectPlayer />;
      case RenderComponentName.PLAYER_CREATE:
        return <CreatePlayer />;
      case RenderComponentName.CHAT:
        return (
          <Chat messages={messages} player={player} roomSelected={!!room} />
        );
      case RenderComponentName.PLAYERS:
        return <Players players={players} />;
      case RenderComponentName.ROOMS:
        return <Rooms />;
      default:
        return <SelectPlayer />;
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <p>RPG</p>
        <button onClick={() => setActiveComponent(RenderComponentName.PLAYERS)}>
          <PlayersOnline players={players} />
        </button>
        <button onClick={() => setActiveComponent(RenderComponentName.CHAT)}>
          Chat
        </button>
        <button
          onClick={() => setActiveComponent(RenderComponentName.PLAYER_DETAILS)}
        >
          Player
        </button>
        <button onClick={() => setActiveComponent(RenderComponentName.ROOMS)}>
          Rooms
        </button>
        <button onClick={logoutHandler}>Log Out</button>
      </nav>
      {renderComponent()}
    </>
  );
};

export default App;
