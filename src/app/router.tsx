import LoginRoute from '@app/app/pages/auth/login-route';
import { paths } from '@app/config/paths';
import { useAuth } from '@app/context/auth-context';
import AppLayout from '@app/shared/layouts/app-layout';
import { lazy } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';

const DashboardRoute = lazy(() => import('./pages/app/dashboard-route'));
const VehicleFleetRoute = lazy(() => import('./pages/app/vehicle-management/vehicle-fleet-route'));
const VehicleTypeRoute = lazy(() => import('./pages/app/vehicle-management/vehicle-type-route'));
const StationRoute = lazy(() => import('./pages/app/station-route'));
const RouteManagementRoute = lazy(() => import('./pages/app/route-management-route'));
const EmployeeRoute = lazy(() => import('./pages/app/employee-route'));
const TripSchedulingRoute = lazy(() => import('./pages/app/trip-scheduling-route'));
const CustomerRoute = lazy(() => import('./pages/app/customer-route'));
const BookingRoute = lazy(() => import('./pages/app/booking-route'));

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
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardNavigate />} />
          <Route path={paths.app.dashboard.path} element={<DashboardRoute />} />
          <Route path={paths.app.vehicleManagement.vehicleFleet.path} element={<VehicleFleetRoute />} />
          <Route path={paths.app.vehicleManagement.vehicleTypes.path} element={<VehicleTypeRoute />} />
          <Route path={paths.app.station.path} element={<StationRoute />} />
          <Route path={paths.app.route.path} element={<RouteManagementRoute />} />
          <Route path={paths.app.employee.path} element={<EmployeeRoute />} />
          <Route path={paths.app.tripScheduling.path} element={<TripSchedulingRoute />} />
          <Route path={paths.app.customer.path} element={<CustomerRoute />} />
          <Route path={paths.app.booking.path} element={<BookingRoute />} />
        </Route>
      </Route>
    </Routes>
  );
};
