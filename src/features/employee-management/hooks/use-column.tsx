import { Employee } from '@app/features/employee-management/types/employee.type';
import dayjs from '@app/lib/date-utils';
import { ConfirmDeleteButton, EditButton } from '@app/shared/components';
import { DateFormat } from '@app/shared/contants';
import { Space, TableProps, Tag } from 'antd';

type UseColumnProps = {
  onEdit: (record: Employee) => void;
  onDelete: (record: Employee) => void;
};

const useColumn = ({ onEdit, onDelete }: UseColumnProps) => {
  const columns: TableProps<Employee>['columns'] = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 200,
      fixed: 'left'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      render: (value) => value || '-'
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 150,
      render: (value) => value || '-'
    },
    {
      title: 'License Number',
      dataIndex: 'license_number',
      key: 'license_number',
      width: 150,
      render: (value) => value || '-'
    },
    {
      title: 'License Expiry',
      dataIndex: 'license_expiry',
      key: 'license_expiry',
      width: 150,
      render: (value) => {
        if (!value) return '-';
        const expiryDate = dayjs(value);
        const isExpired = expiryDate.isBefore(dayjs());
        const isExpiringSoon = expiryDate.diff(dayjs(), 'days') <= 30 && !isExpired;

        return (
          <div className='flex items-center gap-2'>
            <span>{expiryDate.format(DateFormat.DATE_SLASH)}</span>
            {isExpired && <Tag color='red'>Expired</Tag>}
            {isExpiringSoon && <Tag color='orange'>Expiring Soon</Tag>}
          </div>
        );
      }
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
            title='Are you sure you want to delete this employee?'
            onConfirm={() => onDelete(record)}
          />
        </Space>
      )
    }
  ];

  return { columns };
};

export default useColumn;
