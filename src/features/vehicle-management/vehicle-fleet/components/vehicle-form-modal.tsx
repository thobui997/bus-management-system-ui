import { VehicleStatus } from '@app/features/vehicle-management/vehicle-fleet/types/vehicle.type';
import { useVehicleTypes } from '@app/features/vehicle-management/vehicle-type/api/get-vehicle-types.api';
import { Form, FormInstance, Input, InputNumber, Modal, Select } from 'antd';

type VehicleFormModalProps = {
  mode?: 'create' | 'edit';
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<any>;
  handleSubmit: () => Promise<void>;
};

const VehicleFormModal = ({ open, setOpen, form, handleSubmit, mode = 'create' }: VehicleFormModalProps) => {
  const vehicleTypesQuery = useVehicleTypes({
    params: { pageSize: 100 }
  });

  const currentYear = new Date().getFullYear();

  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Create Vehicle' : 'Edit Vehicle'}
      okText={mode === 'create' ? 'Create' : 'Update'}
      cancelText='Cancel'
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      onCancel={() => setOpen(false)}
      destroyOnHidden
      centered
      width={700}
      modalRender={(dom) => (
        <Form layout='vertical' form={form} name='vehicle_form' clearOnDestroy onFinish={() => handleSubmit()}>
          {dom}
        </Form>
      )}
    >
      <div className='grid grid-cols-2 gap-4'>
        <Form.Item name='license_plate' label='License Plate' rules={[{ required: true }]}>
          <Input maxLength={15} placeholder='Enter license plate' />
        </Form.Item>

        <Form.Item name='vehicle_type_id' label='Vehicle Type' rules={[{ required: true }]}>
          <Select
            placeholder='Select vehicle type'
            loading={vehicleTypesQuery.isLoading}
            options={vehicleTypesQuery.data?.data.map((type) => ({
              label: type.type_name,
              value: type.id
            }))}
          />
        </Form.Item>

        <Form.Item name='brand' label='Brand' rules={[{ required: true }]}>
          <Input maxLength={50} placeholder='Enter brand' />
        </Form.Item>

        <Form.Item name='model' label='Model' rules={[{ required: true }]}>
          <Input maxLength={50} placeholder='Enter model' />
        </Form.Item>

        <Form.Item name='year_manufactured' label='Year Manufactured' rules={[{ required: true }]}>
          <InputNumber className='!w-full' min={1900} max={currentYear} placeholder='Enter year' />
        </Form.Item>

        <Form.Item name='seat_capacity' label='Seat Capacity' rules={[{ required: true }]}>
          <InputNumber className='!w-full' min={1} max={100} placeholder='Enter seat capacity' />
        </Form.Item>

        <Form.Item name='manufacturer' label='Manufacturer' rules={[{ required: true }]}>
          <Input maxLength={100} placeholder='Enter manufacturer' />
        </Form.Item>

        <Form.Item name='status' label='Status' rules={[{ required: true }]}>
          <Select
            placeholder='Select status'
            options={[
              { label: 'Active', value: VehicleStatus.ACTIVE },
              { label: 'Inactive', value: VehicleStatus.INACTIVE },
              { label: 'Maintenance', value: VehicleStatus.MAINTENANCE }
            ]}
          />
        </Form.Item>
      </div>
    </Modal>
  );
};

export default VehicleFormModal;
