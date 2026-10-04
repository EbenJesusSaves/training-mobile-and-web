import { Loader } from '@mantine/core';
import { type ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useCurrentUser } from './api/auth-queries';
import { logout, setUser } from './auth-slice';

export function RequireStaff({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const meQuery = useCurrentUser(Boolean(token && !user));

  useEffect(() => {
    if (meQuery.data) {
      if (meQuery.data.role === 'STAFF') dispatch(setUser(meQuery.data));
      else dispatch(logout());
    }
  }, [dispatch, meQuery.data]);

  useEffect(() => {
    if (meQuery.isError) dispatch(logout());
  }, [dispatch, meQuery.isError]);

  if (!token) return <Navigate to="/login" replace />;
  if (user?.role === 'STAFF') return <>{children}</>;
  if (meQuery.isLoading) return <Loader m="xl" />;
  return <Navigate to="/login" replace />;
}
