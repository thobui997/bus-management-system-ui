import { useStations } from '@app/features/station-management/api/get-stations.api';
import { Form, FormInstance, Input, InputNumber, Modal, Select } from 'antd';

type RouteFormModalProps = {
  mode?: 'create' | 'edit';
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<any>;
  handleSubmit: () => Promise<void>;
};

const RouteFormModal = ({ open, setOpen, form, handleSubmit, mode = 'create' }: RouteFormModalProps) => {
  const stationsQuery = useStations({
    params: { pageSize: 100 }
  });

  const startStationId = Form.useWatch('start_station_id', form);
  const endStationId = Form.useWatch('end_station_id', form);

  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Create Route' : 'Edit Route'}
      okText={mode === 'create' ? 'Create' : 'Update'}
      cancelText='Cancel'
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      onCancel={() => setOpen(false)}
      destroyOnHidden
      centered
      width={700}
      modalRender={(dom) => (
        <Form layout='vertical' form={form} name='route_form' clearOnDestroy onFinish={() => handleSubmit()}>
          {dom}
        </Form>
      )}
    >
      <div className='grid grid-cols-2 gap-4'>
        <Form.Item name='route_name' label='Route Name' rules={[{ required: true }]} className='col-span-2'>
          <Input maxLength={255} placeholder='Enter route name' />
        </Form.Item>

        <Form.Item name='start_station_id' label='Start Station' rules={[{ required: true }]}>
          <Select
            placeholder='Select start station'
            showSearch
            loading={stationsQuery.isLoading}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={stationsQuery.data?.data
              .filter((station) => station.id !== endStationId)
              .map((station) => ({
                label: station.station_name,
                value: station.id
              }))}
          />
        </Form.Item>

        <Form.Item name='end_station_id' label='End Station' rules={[{ required: true }]}>
          <Select
            placeholder='Select end station'
            showSearch
            loading={stationsQuery.isLoading}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={stationsQuery.data?.data
              .filter((station) => station.id !== startStationId)
              .map((station) => ({
                label: station.station_name,
                value: station.id
              }))}
          />
        </Form.Item>

        <Form.Item name='distance' label='Distance (km)'>
          <InputNumber className='!w-full' min={0} step={0.1} placeholder='Enter distance' />
        </Form.Item>

        <Form.Item name='standard_duration' label='Standard Duration (minutes)'>
          <InputNumber className='!w-full' min={0} placeholder='Enter duration' />
        </Form.Item>
      </div>
    </Modal>
  );
};

export default RouteFormModal;
