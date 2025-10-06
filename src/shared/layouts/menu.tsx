import { Menu } from 'antd';
import { useNavigate } from 'react-router';
import { MenuList } from '../types';

type MenuProps = {
  menuList: MenuList;
  openKey?: string;
  onChangeOpenKey: (key?: string) => void;
  selectedKey: string;
  onChangeSelectedKey: (key: string) => void;
};

const MenuComponent = ({ menuList, openKey, onChangeOpenKey, selectedKey, onChangeSelectedKey }: MenuProps) => {
  const navigate = useNavigate();

  const getTitle = (menu: MenuList[0]) => {
    return (
      <span className='flex items-center gap-4'>
        {menu.icon && menu.icon}
        <span>{menu.label}</span>
      </span>
    );
  };

  const onMenuClick = (path: string) => {
    onChangeSelectedKey(path);
    navigate(path);
  };

  const onOpenChange = (keys: string[]) => {
    if (keys.length === 0) {
      onChangeOpenKey(undefined);
      return;
    }

    const latestKey = keys[keys.length - 1];

    if (openKey === latestKey) {
      onChangeOpenKey(undefined);
    } else {
      onChangeOpenKey(latestKey);
    }
  };

  const defaultOpenKeys = menuList.filter((menu) => menu.children && menu.children.length).map((m) => m.code);

  return (
    <Menu
      mode='inline'
      defaultOpenKeys={defaultOpenKeys}
      selectedKeys={[selectedKey]}
      openKeys={openKey ? [openKey] : []}
      onOpenChange={onOpenChange}
      onSelect={(k) => onMenuClick(k.key)}
      items={menuList.map((menu) => {
        return menu.children
          ? {
              key: menu.code,
              label: getTitle(menu),
              children: menu.children.map((child) => ({
                key: child.code,
                label: getTitle(child)
              }))
            }
          : {
              key: menu.code,
              label: getTitle(menu)
            };
      })}
    ></Menu>
  );
};

export default MenuComponent;
