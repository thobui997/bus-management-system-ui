import { RoleInTrip, Trip, TripStatus } from '@app/features/trip-scheduling/types/trip.type';
import dayjs from '@app/lib/date-utils';
import { ConfirmDeleteButton, EditButton } from '@app/shared/components';
import { DateFormat } from '@app/shared/contants';
import { Button, Space, TableProps, Tag, Tooltip, Typography } from 'antd';
import { Users } from 'lucide-react';

type UseColumnProps = {
  onEdit: (record: Trip) => void;
  onDelete: (record: Trip) => void;
  onManageAssignments: (record: Trip) => void;
};

const getStatusColor = (status: TripStatus) => {
  switch (status) {
    case TripStatus.ON_TIME:
      return 'green';
    case TripStatus.DELAYED:
      return 'orange';
    case TripStatus.CANCELLED:
      return 'red';
    default:
      return 'default';
  }
};

const useColumn = ({ onEdit, onDelete, onManageAssignments }: UseColumnProps) => {
  const columns: TableProps<Trip>['columns'] = [
    {
      title: 'Route',
      key: 'route',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <div>
          <div className='font-semibold'>{record.route?.route_name}</div>
          <div className='text-xs text-gray-500'>
            {record.route?.start_station?.station_name} → {record.route?.end_station?.station_name}
          </div>
        </div>
      )
    },
    {
      title: 'Vehicle',
      key: 'vehicle',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.vehicle?.license_plate}</div>
          <div className='text-xs text-gray-500'>
            {record.vehicle?.brand} {record.vehicle?.model}
          </div>
        </div>
      )
    },
    {
      title: 'Departure',
      dataIndex: 'departure_time',
      key: 'departure_time',
      width: 150,
      render: (value) => (
        <div className='flex flex-col gap-1'>
          <div>{dayjs(value).format(DateFormat.DATE_SLASH)}</div>
          <div className='text-gray-500'>{dayjs(value).format(DateFormat.TIME_24H)}</div>
        </div>
      )
    },
    {
      title: 'Arrival',
      dataIndex: 'arrival_time',
      key: 'arrival_time',
      width: 150,
      render: (value) => (
        <div className='flex flex-col gap-1'>
          <div>{dayjs(value).format(DateFormat.DATE_SLASH)}</div>
          <div className='text-gray-500'>{dayjs(value).format(DateFormat.TIME_24H)}</div>
        </div>
      )
    },
    {
      title: 'Duration',
      key: 'duration',
      width: 120,
      render: (_, record) => {
        const duration = dayjs(record.arrival_time).diff(dayjs(record.departure_time), 'minute');
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours}h ${minutes}m`;
      }
    },
    {
      title: 'Assignments',
      key: 'assignments',
      width: 200,
      render: (_, record) => {
        const assignments = record.trip_assignments || [];
        const driver = assignments.find((a) => a.role_in_trip === RoleInTrip.DRIVER);
        const assistants = assignments.filter((a) => a.role_in_trip === RoleInTrip.ASSISTANT);

        return (
          <div className='flex flex-col gap-1'>
            {driver && (
              <div className='flex items-center gap-1'>
                <Tag color='blue' className='!m-0'>
                  Driver
                </Tag>
                <Typography.Text className='text-xs truncate max-w-[120px]'>
                  {driver.employee?.full_name}
                </Typography.Text>
              </div>
            )}
            {assistants.length > 0 && (
              <div className='flex items-center gap-1'>
                <Tag color='green' className='!m-0'>
                  Asst ({assistants.length})
                </Tag>
                <Typography.Text className='text-xs truncate max-w-[120px]'>
                  {assistants.map((a) => a.employee?.full_name).join(', ')}
                </Typography.Text>
              </div>
            )}
            {assignments.length === 0 && <Tag color='default'>No assignments</Tag>}
          </div>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: TripStatus) => <Tag color={getStatusColor(value)}>{value.replace('_', ' ').toUpperCase()}</Tag>
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
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space className='!gap-0'>
          <Tooltip title='Manage Assignments'>
            <Button icon={<Users size={20} />} type='text' size='large' onClick={() => onManageAssignments(record)} />
          </Tooltip>
          <EditButton onClick={() => onEdit(record)} />
          <ConfirmDeleteButton
            title='Are you sure you want to delete this trip? This will also delete all associated assignments.'
            onConfirm={() => onDelete(record)}
          />
        </Space>
      )
    }
  ];

  return { columns };
};

export default useColumn;
