import { Form, FormInstance, Input, Modal } from 'antd';

type VehicleTypeFormModalProps = {
  mode?: 'create' | 'edit';
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<any>;
  handleSubmit: () => Promise<void>;
};

const VehicleTypeFormModal = ({ open, setOpen, form, handleSubmit, mode = 'create' }: VehicleTypeFormModalProps) => {
  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Create Vehicle Type' : 'Edit Vehicle Type'}
      okText={mode === 'create' ? 'Create' : 'Update'}
      cancelText='Cancel'
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      onCancel={() => setOpen(false)}
      destroyOnHidden
      centered
      modalRender={(dom) => (
        <Form layout='vertical' form={form} name='form_in_modal' clearOnDestroy onFinish={() => handleSubmit()}>
          {dom}
        </Form>
      )}
    >
      <Form.Item name='type_name' label='Type Name' rules={[{ required: true }]}>
        <Input maxLength={100} />
      </Form.Item>

      <Form.Item name='description' label='Description'>
        <Input.TextArea maxLength={2000} rows={5} />
      </Form.Item>
    </Modal>
  );
};

export default VehicleTypeFormModal;
