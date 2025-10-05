import {
  MaintenanceLog,
  MaintenanceLogStatus
} from '@app/features/vehicle-management/vehicle-fleet/types/maintenance-log.type';
import dayjs from '@app/lib/date-utils';
import { ConfirmDeleteButton, EditButton } from '@app/shared/components';
import { DateFormat } from '@app/shared/contants';
import { Space, TableProps, Tag } from 'antd';

type UseMaintenanceLogColumnProps = {
  onEdit: (record: MaintenanceLog) => void;
  onDelete: (record: MaintenanceLog) => void;
};

const getStatusColor = (status: MaintenanceLogStatus) => {
  switch (status) {
    case MaintenanceLogStatus.SCHEDULED:
      return 'blue';
    case MaintenanceLogStatus.IN_PROGRESS:
      return 'orange';
    case MaintenanceLogStatus.COMPLETED:
      return 'green';
    default:
      return 'default';
  }
};

const useMaintenanceLogColumn = ({ onEdit, onDelete }: UseMaintenanceLogColumnProps) => {
  const columns: TableProps<MaintenanceLog>['columns'] = [
    {
      title: 'Vehicle',
      dataIndex: ['vehicle', 'license_plate'],
      key: 'vehicle',
      width: 150,
      fixed: 'left',
      render: (_, record) => (
        <div className='flex flex-col'>
          <div className='font-semibold'>{record.vehicle?.license_plate}</div>
          <div className='text-gray-500 text-xs'>
            {record.vehicle?.brand} {record.vehicle?.model}
          </div>
        </div>
      )
    },
    {
      title: 'Maintenance Type',
      dataIndex: 'maintenance_type',
      key: 'maintenance_type',
      width: 180
    },
    {
      title: 'Schedule Date',
      dataIndex: 'schedule_date',
      key: 'schedule_date',
      width: 120,
      render: (value) => (value ? dayjs(value).format(DateFormat.DATE_SLASH) : '-')
    },
    {
      title: 'Completion Date',
      dataIndex: 'completion_date',
      key: 'completion_date',
      width: 120,
      render: (value) => (value ? dayjs(value).format(DateFormat.DATE_SLASH) : '-')
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      width: 120,
      align: 'right',
      render: (value) => (value ? value.toLocaleString('vi-VN') + ' đ' : '-')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (value: MaintenanceLogStatus) => (
        <Tag color={getStatusColor(value)}>{value.replace('_', ' ').toUpperCase()}</Tag>
      )
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      width: 200,
      ellipsis: true
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
            title='Are you sure you want to delete this maintenance log?'
            onConfirm={() => onDelete(record)}
          />
        </Space>
      )
    }
  ];

  return { columns };
};

export default useMaintenanceLogColumn;
