import { useVehicles } from '@app/features/vehicle-management/vehicle-fleet/api/get-vehicles.api';
import { MaintenanceLogStatus } from '@app/features/vehicle-management/vehicle-fleet/types/maintenance-log.type';
import { DatePicker, Form, FormInstance, Input, InputNumber, Modal, Select } from 'antd';

type MaintenanceLogFormModalProps = {
  mode?: 'create' | 'edit';
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<any>;
  handleSubmit: () => Promise<void>;
};

const MaintenanceLogFormModal = ({
  open,
  setOpen,
  form,
  handleSubmit,
  mode = 'create'
}: MaintenanceLogFormModalProps) => {
  const vehiclesQuery = useVehicles({
    params: { pageSize: 100 }
  });

  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Create Maintenance Log' : 'Edit Maintenance Log'}
      okText={mode === 'create' ? 'Create' : 'Update'}
      cancelText='Cancel'
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      onCancel={() => setOpen(false)}
      destroyOnHidden
      centered
      width={700}
      modalRender={(dom) => (
        <Form layout='vertical' form={form} name='maintenance_log_form' clearOnDestroy onFinish={() => handleSubmit()}>
          {dom}
        </Form>
      )}
    >
      <div className='grid grid-cols-2 gap-4'>
        <Form.Item name='vehicle_id' label='Vehicle' rules={[{ required: true }]}>
          <Select
            placeholder='Select vehicle'
            showSearch
            loading={vehiclesQuery.isLoading}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={vehiclesQuery.data?.data.map((vehicle) => ({
              label: `${vehicle.license_plate} - ${vehicle.brand} ${vehicle.model}`,
              value: vehicle.id
            }))}
          />
        </Form.Item>

        <Form.Item name='maintenance_type' label='Maintenance Type' rules={[{ required: true }]}>
          <Input maxLength={100} placeholder='Enter maintenance type' />
        </Form.Item>

        <Form.Item name='schedule_date' label='Schedule Date' rules={[{ required: true }]}>
          <DatePicker className='w-full' format='DD/MM/YYYY' placeholder='Select schedule date' />
        </Form.Item>

        <Form.Item name='completion_date' label='Completion Date'>
          <DatePicker className='w-full' format='DD/MM/YYYY' placeholder='Select completion date' />
        </Form.Item>

        <Form.Item name='cost' label='Cost (VND)' rules={[{ required: true }]}>
          <InputNumber
            className='!w-full'
            min={0}
            placeholder='Enter cost'
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
          />
        </Form.Item>

        <Form.Item name='status' label='Status' rules={[{ required: true }]}>
          <Select
            placeholder='Select status'
            options={[
              { label: 'Scheduled', value: MaintenanceLogStatus.SCHEDULED },
              { label: 'In Progress', value: MaintenanceLogStatus.IN_PROGRESS },
              { label: 'Completed', value: MaintenanceLogStatus.COMPLETED }
            ]}
          />
        </Form.Item>

        <Form.Item name='note' label='Note' className='col-span-2'>
          <Input.TextArea rows={4} maxLength={500} placeholder='Enter note' />
        </Form.Item>
      </div>
    </Modal>
  );
};

export default MaintenanceLogFormModal;
