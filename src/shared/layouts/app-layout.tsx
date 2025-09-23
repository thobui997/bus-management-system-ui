import menuList from '@app/config/menu';
import { paths } from '@app/config/paths';
import { Affix, Layout, theme } from 'antd';
import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import './app-layout.scss';
import HeaderComponent from './header';
import MenuComponent from './menu';

const { Content, Sider } = Layout;

const AppLayout = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const location = useLocation();

  const [openKey, setOpenkey] = useState<string>(paths.app + '1');
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);

  if (location.pathname !== selectedKey) {
    setSelectedKey(location.pathname);
  }

  const filteredMenuList = useMemo(() => {
    return menuList.map((item) => ({
      ...item,
      children: item.children
    }));
  }, []);

  return (
    <Layout className='layout-page'>
      <Affix offsetTop={0}>
        <Sider
          className='layout-page-sider'
          style={{ background: colorBgContainer, height: '100vh' }}
          trigger={null}
          collapsible
          width={250}
        >
          <div className='logo-container'>
            <div className='logo-vertical'>
              <div className='logo-image'>
                <img src='/images/bus.png' alt='logo' width={20} height={20} />
              </div>
              <div className='logo-text'>BusManager System</div>
            </div>
          </div>
          <MenuComponent
            menuList={filteredMenuList}
            openKey={openKey}
            onChangeOpenKey={(k) => setOpenkey(k || '')}
            selectedKey={selectedKey}
            onChangeSelectedKey={(k) => setSelectedKey(k)}
          />
        </Sider>
      </Affix>

      <Layout>
        <HeaderComponent />
        <Content className='!m-6 flex flex-col flex-1'>
          <div className='!p-4 flex flex-col flex-1 gap-6'>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
