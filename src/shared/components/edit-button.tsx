import { Button } from 'antd';
import { SquarePen } from 'lucide-react';
import { ComponentProps } from 'react';

const EditButton = (props: ComponentProps<typeof Button>) => {
  return <Button {...props} icon={<SquarePen />} type='text' size='large' />;
};

export default EditButton;
