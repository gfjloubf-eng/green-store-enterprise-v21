import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js?v=4', { updateViaCache: 'none' })
      .catch(() => undefined);
  });
}

const bootSplash = document.getElementById('boot-splash');
const hideBootSplash = () => {
  if (!bootSplash) return;
  bootSplash.classList.add('boot-splash--hide');
  window.setTimeout(() => bootSplash.remove(), 280);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

window.setTimeout(hideBootSplash, 720);
