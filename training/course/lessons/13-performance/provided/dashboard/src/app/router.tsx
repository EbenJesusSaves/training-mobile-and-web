import { Loader } from '@mantine/core';
import { createBrowserRouter, Navigate } from 'react-router';

import { RequireStaff } from '../features/auth/require-staff';
import { DashboardLayout } from './layouts/dashboard-layout';
import { Component as BookingsRoute } from './routes/bookings-route';
import { Component as JourneysRoute } from './routes/journeys-route';
import { Component as OverviewRoute } from './routes/overview-route';

// Each route module exports `Component`, so React Router code-splits it into its own chunk.
export const router = createBrowserRouter([
  {
    hydrateFallbackElement: <Loader m="xl" />,
    children: [
      { path: '/login', lazy: () => import('./routes/login-route') },
      {
        path: '/',
        element: (
          <RequireStaff>
            <DashboardLayout />
          </RequireStaff>
        ),
        children: [
          { index: true, Component: OverviewRoute },
          // LIVE 13.6 — Restore lazy route modules for overview, journeys, and bookings.
          { path: 'journeys', Component: JourneysRoute },
          { path: 'journeys/:journeyId', lazy: () => import('./routes/journey-detail-route') },
          { path: 'network', lazy: () => import('./routes/network-route') },
          { path: 'bookings', Component: BookingsRoute },
          { path: 'passengers', lazy: () => import('./routes/passengers-route') },
          { path: 'passengers/:passengerId', lazy: () => import('./routes/passenger-detail-route') },
          { path: 'extras', lazy: () => import('./routes/extras-route') },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
