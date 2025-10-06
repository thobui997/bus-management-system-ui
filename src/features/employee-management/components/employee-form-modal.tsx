import { DatePicker, Form, FormInstance, Input, Modal } from 'antd';

type EmployeeFormModalProps = {
  mode?: 'create' | 'edit';
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<any>;
  handleSubmit: () => Promise<void>;
};

const EmployeeFormModal = ({ open, setOpen, form, handleSubmit, mode = 'create' }: EmployeeFormModalProps) => {
  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Create Employee' : 'Edit Employee'}
      okText={mode === 'create' ? 'Create' : 'Update'}
      cancelText='Cancel'
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      onCancel={() => setOpen(false)}
      destroyOnHidden
      centered
      width={700}
      modalRender={(dom) => (
        <Form layout='vertical' form={form} name='employee_form' clearOnDestroy onFinish={() => handleSubmit()}>
          {dom}
        </Form>
      )}
    >
      <div className='grid grid-cols-2 gap-4'>
        <Form.Item name='full_name' label='Full Name' rules={[{ required: true }]} className='col-span-2'>
          <Input maxLength={100} placeholder='Enter full name' />
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

        <Form.Item name='phone_number' label='Phone Number'>
          <Input maxLength={15} placeholder='Enter phone number' />
        </Form.Item>

        <Form.Item name='license_number' label='License Number'>
          <Input maxLength={20} placeholder='Enter license number' />
        </Form.Item>

        <Form.Item name='license_expiry' label='License Expiry'>
          <DatePicker className='w-full' format='DD/MM/YYYY' placeholder='Select expiry date' />
        </Form.Item>
      </div>
    </Modal>
  );
};

export default EmployeeFormModal;
