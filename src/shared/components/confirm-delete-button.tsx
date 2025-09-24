import { Button, Popconfirm } from 'antd';
import { Trash } from 'lucide-react';
import { ComponentProps } from 'react';

const ConfirmDeleteButton = (props: ComponentProps<typeof Popconfirm>) => {
  return (
    <Popconfirm
      {...props}
      description='This action cannot be undone.'
      okText='Delete'
      cancelText='Cancel'
      placement='bottomLeft'
    >
      <Button icon={<Trash size={20} />} danger type='text' size='large' />
    </Popconfirm>
  );
};

export default ConfirmDeleteButton;
