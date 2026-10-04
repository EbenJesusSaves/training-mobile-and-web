// Course version (lesson 01) — becomes the full RailPass version in lesson 05.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { env } from './shared/config/env';

function HelloDashboard() {
  // LIVE 01.6 — Render the API URL and /health result so setup proves the browser can reach the API.
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 32 }}>
      <p>RailPass dashboard setup</p>
      <h1>Connect the staff dashboard</h1>
      <p>API URL: {env.apiUrl}</p>
      <p>Health: pending</p>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelloDashboard />
  </StrictMode>,
);
