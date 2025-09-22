import LoginRoute from '@app/app/pages/auth/login-route';
import { paths } from '@app/config/paths';
import { useAuth } from '@app/context/auth-context';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';

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

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={paths.auth.login.path} element={<LoginRoute />} />
    </Routes>
  );
};
