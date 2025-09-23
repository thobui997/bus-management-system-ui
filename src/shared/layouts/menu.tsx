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

  const findParentPath = (path: string) => {
    const pathSegments = path.split('/').filter(Boolean);

    if (pathSegments.length > 1) {
      const parentPath = '/' + pathSegments[0];
      const parentExists = menuList.some((menu) => menu.path === parentPath);

      if (parentExists) {
        return parentPath;
      }
    }

    return path;
  };

  const getTitle = (menu: MenuList[0]) => {
    return (
      <span style={{ display: 'flex', alignItems: 'center' }}>
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
    const key = keys.pop();
    onChangeOpenKey(key);
  };

  const activeMenuKey = findParentPath(selectedKey);

  return (
    <Menu
      mode='inline'
      selectedKeys={[activeMenuKey]}
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
              key: menu.path,
              label: getTitle(menu)
            };
      })}
    ></Menu>
  );
};

export default MenuComponent;
