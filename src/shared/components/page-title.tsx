import { memo } from 'react';
import Title from 'antd/es/typography/Title';
import { Space } from 'antd';

type PageTitleProps = {
  title: string;
  subTitle?: string;
};

const PageTitle = ({ title, subTitle }: PageTitleProps) => {
  return (
    <Space direction='vertical' size={0}>
      <Title level={3} className='!mb-0'>
        {title}
      </Title>
      {subTitle && <div className='text-gray-500'>{subTitle}</div>}
    </Space>
  );
};

export default memo(PageTitle);
