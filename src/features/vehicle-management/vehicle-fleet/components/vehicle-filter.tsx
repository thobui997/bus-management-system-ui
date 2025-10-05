import { useVehicleTypes } from '@app/features/vehicle-management/vehicle-type/api/get-vehicle-types.api';
import { VehicleStatus } from '@app/features/vehicle-management/vehicle-fleet/types/vehicle.type';
import { Select, Space } from 'antd';

type VehicleFilterProps = {
  onStatusChange: (status?: VehicleStatus) => void;
  onVehicleTypeChange: (vehicleTypeId?: number) => void;
};

const VehicleFilter = ({ onStatusChange, onVehicleTypeChange }: VehicleFilterProps) => {
  const vehicleTypesQuery = useVehicleTypes({
    params: { pageSize: 100 }
  });

  return (
    <Space>
      <Select
        size='large'
        placeholder='Filter by status'
        allowClear
        style={{ width: 200 }}
        onChange={onStatusChange}
        options={[
          { label: 'Active', value: VehicleStatus.ACTIVE },
          { label: 'Inactive', value: VehicleStatus.INACTIVE },
          { label: 'Maintenance', value: VehicleStatus.MAINTENANCE }
        ]}
      />

      <Select
        size='large'
        placeholder='Filter by vehicle type'
        allowClear
        style={{ width: 200 }}
        loading={vehicleTypesQuery.isLoading}
        onChange={onVehicleTypeChange}
        options={vehicleTypesQuery.data?.data.map((type) => ({
          label: type.type_name,
          value: type.id
        }))}
      />
    </Space>
  );
};

export default VehicleFilter;
