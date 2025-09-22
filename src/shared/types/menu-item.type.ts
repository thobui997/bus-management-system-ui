import { ReactNode } from 'react';
import { RoleEnumType } from '../enums';

interface MenuItem {
  code: string;
  label: string;
  path: string;
  icon?: ReactNode;
  children?: MenuItem[];
  roles?: RoleEnumType[];
}

export type MenuChild = Omit<MenuItem, 'children'>;
export type MenuList = MenuItem[];
