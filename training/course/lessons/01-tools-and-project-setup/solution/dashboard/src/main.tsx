// Course version (lesson 01) — becomes the full RailPass version in lesson 05.
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { env } from './shared/config/env';

type HealthState = 'checking' | 'ok' | 'unreachable';

function HelloDashboard() {
  const [health, setHealth] = useState<HealthState>('checking');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${env.apiUrl}/health`, { signal: controller.signal })
      .then((response) => setHealth(response.ok ? 'ok' : 'unreachable'))
      .catch(() => {
        if (!controller.signal.aborted) setHealth('unreachable');
      });
    return () => controller.abort();
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 32 }}>
      <p>RailPass dashboard setup</p>
      <h1>Connect the staff dashboard</h1>
      <p>API URL: {env.apiUrl}</p>
      <p>Health: {health}</p>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelloDashboard />
  </StrictMode>,
);
