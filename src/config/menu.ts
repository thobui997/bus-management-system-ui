import { DashboardOutlined } from '@ant-design/icons';
import { paths } from '@app/config/paths';
import { MenuList } from '@app/shared/types/menu-item.type';
import React from 'react';

const menuList: MenuList = [
  {
    code: paths.app.dashboard.path,
    label: 'Dashboard',
    path: paths.app.dashboard.path,
    icon: React.createElement(DashboardOutlined)
  }
];

export default menuList;
