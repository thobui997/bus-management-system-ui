import { InteractionOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { paths } from '@app/config/paths';
import { Affix, Avatar, Badge, Dropdown, Layout, MenuProps, Space, theme, Typography } from 'antd';
import { Bell } from 'lucide-react';

const { Header } = Layout;

const HeaderComponent = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Profile',
      icon: <UserOutlined />
    },
    {
      key: '2',
      label: 'Change Password',
      icon: <InteractionOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: '3',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.clear();
        window.location.href = paths.auth.login.getHref(window.location.pathname);
      }
    }
  ];

  return (
    <Affix offsetTop={0}>
      <Header className='layout-page-header' style={{ background: colorBgContainer }}>
        <a href='/'>
          <div className='logo'>lOGO</div>
        </a>
        <div className='layout-page-header-actions'>
          <Badge count={5} size='small'>
            <Bell size={20} />
          </Badge>

          <Dropdown menu={{ items }} overlayStyle={{ width: 200 }}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar
                style={{ backgroundColor: '#87d068' }}
                icon={<UserOutlined />}
                src='https://media.istockphoto.com/id/588348500/vector/male-avatar-profile-picture-vector.jpg?s=612x612&w=0&k=20&c=tPPah8S9tmcyOXCft1Ct0tCAdpfSaUNhGzJK7kQiQCg='
              >
                Super Admin
              </Avatar>
              <Typography.Text style={{ color: '#333' }}> Super Admin</Typography.Text>
            </Space>
          </Dropdown>
        </div>
      </Header>
    </Affix>
  );
};

export default HeaderComponent;
