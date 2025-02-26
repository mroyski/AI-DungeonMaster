import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './lib/AuthContext';
import { RenderComponentProvider } from './lib/RenderComponentContext';
import { PlayerProvider } from './lib/PlayerContext';
import { SocketProvider } from './lib/SocketContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PlayerProvider>
        <SocketProvider>
          <RenderComponentProvider>
            <App />
          </RenderComponentProvider>
        </SocketProvider>
      </PlayerProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
