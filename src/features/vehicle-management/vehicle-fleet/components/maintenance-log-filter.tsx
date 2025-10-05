import { useVehicles } from '@app/features/vehicle-management/vehicle-fleet/api/get-vehicles.api';
import { MaintenanceLogStatus } from '@app/features/vehicle-management/vehicle-fleet/types/maintenance-log.type';
import { Select, Space } from 'antd';

type MaintenanceLogFilterProps = {
  onStatusChange: (status?: MaintenanceLogStatus) => void;
  onVehicleChange: (vehicleId?: number) => void;
};

const MaintenanceLogFilter = ({ onStatusChange, onVehicleChange }: MaintenanceLogFilterProps) => {
  const vehiclesQuery = useVehicles({
    params: { pageSize: 100 }
  });

  return (
    <Space size='large'>
      <Select
        size='large'
        placeholder='Filter by status'
        allowClear
        style={{ width: 200 }}
        onChange={onStatusChange}
        options={[
          { label: 'Scheduled', value: MaintenanceLogStatus.SCHEDULED },
          { label: 'In Progress', value: MaintenanceLogStatus.IN_PROGRESS },
          { label: 'Completed', value: MaintenanceLogStatus.COMPLETED }
        ]}
      />

      <Select
        size='large'
        placeholder='Filter by vehicle'
        allowClear
        showSearch
        style={{ width: 250 }}
        loading={vehiclesQuery.isLoading}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        onChange={onVehicleChange}
        options={vehiclesQuery.data?.data.map((vehicle) => ({
          label: `${vehicle.license_plate} - ${vehicle.brand} ${vehicle.model}`,
          value: vehicle.id
        }))}
      />
    </Space>
  );
};

export default MaintenanceLogFilter;
