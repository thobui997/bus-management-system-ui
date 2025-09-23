import { paths } from '@app/config/paths';
import { MenuList } from '@app/shared/types/menu-item.type';
import { Bus, Diamond, LayoutDashboard } from 'lucide-react';
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
    icon: React.createElement(LayoutDashboard, { size: 20, style: { marginRight: 10 } })
  },
  {
    code: paths.app.vehicleManagement.path,
    label: 'Vehicle Management',
    path: paths.app.vehicleManagement.path,
    icon: React.createElement(Bus, { size: 20, style: { marginRight: 10 } }),
    children: [
      {
        code: paths.app.vehicleManagement.vehicleFleet.path,
        label: 'Vehicle Fleet',
        icon: React.createElement(Diamond, { size: 16, style: { marginRight: 8 } }),
        path: paths.app.vehicleManagement.vehicleFleet.path
      },
      {
        code: paths.app.vehicleManagement.vehicleTypes.path,
        label: 'Vehicle Types',
        icon: React.createElement(Diamond, { size: 16, style: { marginRight: 8 } }),
        path: paths.app.vehicleManagement.vehicleTypes.path
      }
    ]
  }
  // {
  //   code: '',
  //   label: 'Route Management',
  //   path: '',
  //   icon: React.createElement(MapPin, { size: 20, style: { marginRight: 10 } })
  // },
  // {
  //   code: '',
  //   label: 'Trip Scheduling',
  //   path: '',
  //   icon: React.createElement(Calendar, { size: 20, style: { marginRight: 10 } })
  // },
  // {
  //   code: '',
  //   label: 'Employee Management',
  //   path: '',
  //   icon: React.createElement(Users, { size: 20, style: { marginRight: 10 } })
  // },
  // {
  //   code: '',
  //   label: 'Ticketing & Booking',
  //   path: '',
  //   icon: React.createElement(Ticket, { size: 20, style: { marginRight: 10 } })
  // },
  // {
  //   code: '',
  //   label: 'Customer Management',
  //   path: '',
  //   icon: React.createElement(User, { size: 20, style: { marginRight: 10 } })
  // },
  // {
  //   code: '',
  //   label: 'Station Management',
  //   path: '',
  //   icon: React.createElement(Building, { size: 20, style: { marginRight: 10 } })
  // }
];

export default menuList;
