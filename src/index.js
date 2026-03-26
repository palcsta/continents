import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CountryProvider } from './context/CountryContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <CountryProvider>
    <App />
  </CountryProvider>
);
