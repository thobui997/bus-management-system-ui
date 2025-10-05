import { Form, FormInstance, Input, Modal } from 'antd';

type StationFormModalProps = {
  mode?: 'create' | 'edit';
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<any>;
  handleSubmit: () => Promise<void>;
};

const StationFormModal = ({ open, setOpen, form, handleSubmit, mode = 'create' }: StationFormModalProps) => {
  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Create Station' : 'Edit Station'}
      okText={mode === 'create' ? 'Create' : 'Update'}
      cancelText='Cancel'
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      onCancel={() => setOpen(false)}
      destroyOnHidden
      centered
      width={600}
      modalRender={(dom) => (
        <Form layout='vertical' form={form} name='station_form' clearOnDestroy onFinish={() => handleSubmit()}>
          {dom}
        </Form>
      )}
    >
      <Form.Item name='station_name' label='Station Name' rules={[{ required: true }]}>
        <Input maxLength={100} placeholder='Enter station name' />
      </Form.Item>

      <Form.Item name='address' label='Address'>
        <Input.TextArea rows={3} maxLength={255} placeholder='Enter station address' />
      </Form.Item>
    </Modal>
  );
};

export default StationFormModal;
