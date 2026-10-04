import { Loader } from '@mantine/core';
import { createBrowserRouter, Navigate } from 'react-router';

import { RequireStaff } from '../features/auth/require-staff';
import { DashboardLayout } from './layouts/dashboard-layout';

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
          { index: true, lazy: () => import('./routes/overview-route') },
          { path: 'journeys', lazy: () => import('./routes/journeys-route') },
          { path: 'journeys/:journeyId', lazy: () => import('./routes/journey-detail-route') },
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
