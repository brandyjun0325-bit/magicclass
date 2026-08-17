import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import MagicTalkEntry from './MagicTalkEntry';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <MagicTalkEntry />
  </React.StrictMode>
);
