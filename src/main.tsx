import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { sembrarDatos } from './utils/seedData.ts';

// Cargar datos de ejemplo si la base de datos está vacía
sembrarDatos().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
