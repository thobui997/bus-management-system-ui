import { useRoutes } from '@app/features/route-management/api/get-routes.api';
import { useVehicles } from '@app/features/vehicle-management/vehicle-fleet/api/get-vehicles.api';
import { TripStatus } from '@app/features/trip-scheduling/types/trip.type';
import { DatePicker, Form, FormInstance, Modal, Select, TimePicker } from 'antd';
import dayjs from '@app/lib/date-utils';

type TripFormModalProps = {
  mode?: 'create' | 'edit';
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<any>;
  handleSubmit: () => Promise<void>;
};

const TripFormModal = ({ open, setOpen, form, handleSubmit, mode = 'create' }: TripFormModalProps) => {
  const routesQuery = useRoutes({ params: { pageSize: 100 } });
  const vehiclesQuery = useVehicles({ params: { pageSize: 100 } });

  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Create Trip' : 'Edit Trip'}
      okText={mode === 'create' ? 'Create' : 'Update'}
      cancelText='Cancel'
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      onCancel={() => setOpen(false)}
      destroyOnHidden
      centered
      width={700}
      modalRender={(dom) => (
        <Form layout='vertical' form={form} name='trip_form' clearOnDestroy onFinish={() => handleSubmit()}>
          {dom}
        </Form>
      )}
    >
      <div className='grid grid-cols-2 gap-4'>
        <Form.Item name='route_id' label='Route' rules={[{ required: true }]}>
          <Select
            placeholder='Select route'
            showSearch
            loading={routesQuery.isLoading}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={routesQuery.data?.data.map((route) => ({
              label: `${route.route_name} (${route.start_station?.station_name} - ${route.end_station?.station_name})`,
              value: route.id
            }))}
          />
        </Form.Item>

        <Form.Item name='vehicle_id' label='Vehicle' rules={[{ required: true }]}>
          <Select
            placeholder='Select vehicle'
            showSearch
            loading={vehiclesQuery.isLoading}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={vehiclesQuery.data?.data
              .filter((vehicle) => vehicle.status === 'active')
              .map((vehicle) => ({
                label: `${vehicle.license_plate} - ${vehicle.brand} ${vehicle.model}`,
                value: vehicle.id
              }))}
          />
        </Form.Item>

        <Form.Item name='departure_date' label='Departure Date' rules={[{ required: true }]}>
          <DatePicker className='w-full' format='DD/MM/YYYY' />
        </Form.Item>

        <Form.Item name='departure_time' label='Departure Time' rules={[{ required: true }]}>
          <TimePicker className='w-full' format='HH:mm' />
        </Form.Item>

        <Form.Item name='arrival_date' label='Arrival Date' rules={[{ required: true }]}>
          <DatePicker className='w-full' format='DD/MM/YYYY' />
        </Form.Item>

        <Form.Item name='arrival_time' label='Arrival Time' rules={[{ required: true }]}>
          <TimePicker className='w-full' format='HH:mm' />
        </Form.Item>

        <Form.Item name='status' label='Status' rules={[{ required: true }]} className='col-span-2'>
          <Select
            placeholder='Select status'
            options={[
              { label: 'On Time', value: TripStatus.ON_TIME },
              { label: 'Delayed', value: TripStatus.DELAYED },
              { label: 'Cancelled', value: TripStatus.CANCELLED }
            ]}
          />
        </Form.Item>
      </div>
    </Modal>
  );
};

export default TripFormModal;
