import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

const rootElement = document.getElementById('root');

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>,
  );
} catch (error) {
  rootElement.innerHTML = `
    <main style="min-height:100vh;display:grid;place-items:center;background:#050505;color:#f5f5f5;font-family:system-ui,sans-serif;padding:24px;">
      <section style="max-width:560px;border:1px solid rgba(239,68,68,.35);background:#09090b;border-radius:12px;padding:24px;">
        <p style="color:#fca5a5;text-transform:uppercase;letter-spacing:.18em;font-size:12px;">Startup Error</p>
        <h1 style="font-size:24px;margin:12px 0;">PipVault could not start</h1>
        <p style="color:#a1a1aa;line-height:1.6;">Open the browser console or clear local storage for this site, then reload.</p>
        <pre style="white-space:pre-wrap;color:#fecaca;background:#000;padding:12px;border-radius:8px;overflow:auto;">${error.message}</pre>
      </section>
    </main>
  `;
}
