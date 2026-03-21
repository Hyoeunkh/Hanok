import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useGetMe } from '@/api/hooks/useGetMe';

import Loading from './Loading';

export default function AdminOnlyRoute() {
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'));
  const { data: me, isLoading } = useGetMe({ enabled: isLoggedIn });

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!me?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
