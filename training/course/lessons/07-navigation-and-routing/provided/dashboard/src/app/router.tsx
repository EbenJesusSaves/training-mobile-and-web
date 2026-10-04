// Course version (lesson 07) — becomes the full RailPass version in lesson 12.
import { Loader } from '@mantine/core';
import { createBrowserRouter, Navigate } from 'react-router';

import { DashboardLayout } from './layouts/dashboard-layout';

export const router = createBrowserRouter([
  {
    hydrateFallbackElement: <Loader m="xl" />,
    children: [
      { path: '/login', lazy: () => import('./routes/login-route') },
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          { index: true, lazy: () => import('./routes/overview-route') },
          { path: 'journeys', lazy: () => import('./routes/journeys-route') },
          // LIVE 07.5 — Add the lazy journey detail route and keep route modules code-split.
          { path: 'network', lazy: () => import('./routes/network-route') },
          { path: 'bookings', lazy: () => import('./routes/bookings-route') },
          { path: 'passengers', lazy: () => import('./routes/passengers-route') },
          { path: 'passengers/:passengerId', lazy: () => import('./routes/passenger-detail-route') },
          { path: 'extras', lazy: () => import('./routes/extras-route') },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
