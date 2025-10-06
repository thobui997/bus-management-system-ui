import { Form, FormInstance, Input, InputNumber, Modal } from 'antd';

type CustomerFormModalProps = {
  mode?: 'create' | 'edit';
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<any>;
  handleSubmit: () => Promise<void>;
};

const CustomerFormModal = ({ open, setOpen, form, handleSubmit, mode = 'create' }: CustomerFormModalProps) => {
  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Create Customer' : 'Edit Customer'}
      okText={mode === 'create' ? 'Create' : 'Update'}
      cancelText='Cancel'
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      onCancel={() => setOpen(false)}
      destroyOnHidden
      centered
      width={600}
      modalRender={(dom) => (
        <Form layout='vertical' form={form} name='customer_form' clearOnDestroy onFinish={() => handleSubmit()}>
          {dom}
        </Form>
      )}
    >
      <Form.Item name='full_name' label='Full Name' rules={[{ required: true }]}>
        <Input maxLength={100} placeholder='Enter full name' />
      </Form.Item>

      <Form.Item
        name='phone_number'
        label='Phone Number'
        rules={[
          {
            pattern: /^[0-9]{10,15}$/,
            message: 'Please enter a valid phone number (10-15 digits)'
          }
        ]}
      >
        <Input maxLength={15} placeholder='Enter phone number' />
      </Form.Item>

      <Form.Item
        name='email'
        label='Email'
        rules={[
          {
            type: 'email',
            message: 'Please enter a valid email'
          }
        ]}
      >
        <Input maxLength={255} placeholder='Enter email' />
      </Form.Item>

      <Form.Item name='loyalty_points' label='Loyalty Points'>
        <InputNumber className='!w-full' min={0} placeholder='Enter loyalty points' />
      </Form.Item>
    </Modal>
  );
};

export default CustomerFormModal;
