import LoginRoute from '@app/app/pages/auth/login-route';
import { paths } from '@app/config/paths';
import { useAuth } from '@app/context/auth-context';
import AppLayout from '@app/shared/layouts/app-layout';
import { lazy } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';

const DashboardRoute = lazy(() => import('./pages/app/dashboard-route'));

const ProtectedRoute = () => {
  const user = useAuth();
  const location = useLocation();

  if (!user.authInfo?.token) return <Navigate to={paths.auth.login.getHref(location.pathname)} replace />;
  return <Outlet />;
};

// const RequireRoute = ({ allowedRoles }: { allowedRoles: RoleEnumType[] }) => {
//   const { userInfo } = useAuth();
//   const currenrRoles = userInfo?.userRoles?.map((userRole) => userRole.role.name) || [];
//   const hasAccess = currenrRoles.some((role) => allowedRoles.includes(role as RoleEnumType));

//   return hasAccess ? <Outlet /> : null;
// };

const DashboardNavigate = () => {
  return <Navigate to={paths.app.dashboard.path} replace />;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={paths.auth.login.path} element={<LoginRoute />} />
      <Route element={<AppLayout />}>
        <Route index element={<DashboardNavigate />} />
        <Route path={paths.app.dashboard.path} element={<DashboardRoute />} />
      </Route>
    </Routes>
  );
};
