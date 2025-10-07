import { Tabs } from 'antd';
import { TabsProps } from 'antd/lib/tabs';
import React from 'react';
import './tab-layout.scss';

interface TabLayoutProps extends Omit<TabsProps, 'items'> {
  items: TabsProps['items'];
  children?: React.ReactNode;
}

const TabLayout: React.FC<TabLayoutProps> = ({ items, children, ...rest }) => {
  return (
    <div className='h-full overflow-hidden'>
      <Tabs {...rest} items={items} size='large' />
      {children}
    </div>
  );
};

export default TabLayout;
