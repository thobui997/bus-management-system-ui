import { Vehicle, VehicleStatus } from '@app/features/vehicle-management/vehicle-fleet/types/vehicle.type';
import dayjs from '@app/lib/date-utils';
import { ConfirmDeleteButton, EditButton } from '@app/shared/components';
import { DateFormat } from '@app/shared/contants';
import { Space, TableProps, Tag } from 'antd';

type UseColumnProps = {
  onEdit: (record: Vehicle) => void;
  onDelete: (record: Vehicle) => void;
};

const getStatusColor = (status: VehicleStatus) => {
  switch (status) {
    case VehicleStatus.ACTIVE:
      return 'green';
    case VehicleStatus.INACTIVE:
      return 'default';
    case VehicleStatus.MAINTENANCE:
      return 'orange';
    case VehicleStatus.RETIRED:
      return 'red';
    default:
      return 'default';
  }
};

const useColumn = ({ onEdit, onDelete }: UseColumnProps) => {
  const columns: TableProps<Vehicle>['columns'] = [
    {
      title: 'License Plate',
      dataIndex: 'license_plate',
      key: 'license_plate',
      width: 150,
      fixed: 'left'
    },
    {
      title: 'Vehicle Type',
      dataIndex: ['vehicle_type', 'type_name'],
      key: 'vehicle_type',
      width: 150
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 120
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      width: 120
    },
    {
      title: 'Year',
      dataIndex: 'year_manufactured',
      key: 'year_manufactured',
      width: 100
    },
    {
      title: 'Seats',
      dataIndex: 'seat_capacity',
      key: 'seat_capacity',
      width: 80,
      align: 'center'
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 150
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: VehicleStatus) => <Tag color={getStatusColor(value)}>{value.toUpperCase()}</Tag>
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (value) => (
        <div className='flex flex-col gap-1'>
          <div>{dayjs(value).format(DateFormat.DATE_SLASH)}</div>
          <div className='text-gray-500'>{dayjs(value).format(DateFormat.TIME_24H)}</div>
        </div>
      )
    },
    {
      key: 'action',
      title: 'Action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space className='!gap-0'>
          <EditButton onClick={() => onEdit(record)} />
          <ConfirmDeleteButton
            title='Are you sure you want to delete this vehicle?'
            onConfirm={() => onDelete(record)}
          />
        </Space>
      )
    }
  ];

  return { columns };
};

export default useColumn;
