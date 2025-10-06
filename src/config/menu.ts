import { paths } from '@app/config/paths';
import { MenuList } from '@app/shared/types/menu-item.type';
import {
  Building,
  Bus,
  Calendar,
  CreditCard,
  Diamond,
  LayoutDashboard,
  MapPin,
  Ticket,
  User,
  Users
} from 'lucide-react';
import React from 'react';

// const menuItems = [
//   { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//   { id: 'vehicles', icon: Bus, label: 'Vehicle Management' },
//   { id: 'routes', icon: MapPin, label: 'Route Management' },
//   { id: 'trips', icon: Calendar, label: 'Trip Scheduling' },
//   { id: 'employees', icon: Users, label: 'Employee Management' },
//   { id: 'ticketing', icon: Ticket, label: 'Ticketing & Booking' },
//   { id: 'customers', icon: User, label: 'Customer Management' },
//   { id: 'stations', icon: Building, label: 'Station Management' },
//   { id: 'finance', icon: DollarSign, label: 'Finance' },
//   { id: 'reports', icon: BarChart3, label: 'Reports & Analytics' },
//   { id: 'integrations', icon: Settings, label: 'Integrations' },
//   { id: 'security', icon: Shield, label: 'Security' }
// ];

const menuList: MenuList = [
  {
    code: paths.app.dashboard.path,
    label: 'Dashboard',
    path: paths.app.dashboard.path,
    icon: React.createElement(LayoutDashboard, { size: 20 })
  },
  {
    code: paths.app.vehicleManagement.path,
    label: 'Vehicle Management',
    path: paths.app.vehicleManagement.path,
    icon: React.createElement(Bus, { size: 20 }),
    children: [
      {
        code: paths.app.vehicleManagement.vehicleFleet.path,
        label: 'Vehicle Fleet',
        icon: React.createElement(Diamond, { size: 16 }),
        path: paths.app.vehicleManagement.vehicleFleet.path
      },
      {
        code: paths.app.vehicleManagement.vehicleTypes.path,
        label: 'Vehicle Types',
        icon: React.createElement(Diamond, { size: 16 }),
        path: paths.app.vehicleManagement.vehicleTypes.path
      }
    ]
  },
  {
    code: paths.app.station.path,
    label: 'Station Management',
    path: paths.app.station.path,
    icon: React.createElement(Building, { size: 20 })
  },
  {
    code: paths.app.route.path,
    label: 'Route Management',
    path: paths.app.route.path,
    icon: React.createElement(MapPin, { size: 20 })
  },
  {
    code: paths.app.tripScheduling.path,
    label: 'Trip Scheduling',
    path: paths.app.tripScheduling.path,
    icon: React.createElement(Calendar, { size: 20 })
  },
  {
    code: paths.app.employee.path,
    label: 'Employee Management',
    path: paths.app.employee.path,
    icon: React.createElement(Users, { size: 20 })
  },
  {
    code: paths.app.customer.path,
    label: 'Customer Management',
    path: paths.app.customer.path,
    icon: React.createElement(User, { size: 20 })
  },
  {
    code: paths.app.booking.path,
    label: 'Ticketing & Booking',
    path: paths.app.booking.path,
    icon: React.createElement(Ticket, { size: 20 })
  },
  {
    code: paths.app.payment.path,
    label: 'Payment Management',
    path: paths.app.payment.path,
    icon: React.createElement(CreditCard, { size: 20 })
  }
];

export default menuList;
