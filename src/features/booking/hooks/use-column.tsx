import { Booking, BookingStatus } from '@app/features/booking/types/booking.type';
import dayjs from '@app/lib/date-utils';
import { ConfirmDeleteButton, EditButton } from '@app/shared/components';
import { DateFormat } from '@app/shared/contants';
import { Button, Space, TableProps, Tag, Tooltip } from 'antd';
import { CreditCard, Eye, Ticket as TicketIcon } from 'lucide-react';

type UseColumnProps = {
  onEdit: (record: Booking) => void;
  onDelete: (record: Booking) => void;
  onCreatePayment?: (record: Booking) => void;
  onViewDetail?: (record: Booking) => void; // Add this
};

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.CONFIRMED:
      return 'green';
    case BookingStatus.PENDING_PAYMENT:
      return 'orange';
    case BookingStatus.CANCELLED:
      return 'red';
    default:
      return 'default';
  }
};

const useColumn = ({ onEdit, onDelete, onCreatePayment, onViewDetail }: UseColumnProps) => {
  const columns: TableProps<Booking>['columns'] = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left'
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div className='flex flex-col'>
          <div className='font-semibold'>{record.customer?.full_name}</div>
          <div className='text-gray-500 text-xs'>{record.customer?.email}</div>
          <div className='text-gray-500 text-xs'>{record.customer?.phone_number}</div>
        </div>
      )
    },
    {
      title: 'Trip',
      key: 'trip',
      width: 150,
      render: (_, record) => (
        <div className='flex flex-col'>
          <div>Trip #{record.trip?.id}</div>
          <div className='text-gray-500 text-xs'>
            {record.trip?.departure_time ? dayjs(record.trip.departure_time).format(DateFormat.DATE_TIME_SHORT) : '-'}
          </div>
        </div>
      )
    },
    {
      title: 'Tickets',
      key: 'tickets',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const count = Array.isArray(record.tickets) ? record.tickets.length : 0;
        return (
          <Tag color={count > 0 ? 'blue' : 'default'}>
            <div className='flex items-center gap-1 justify-center'>
              <TicketIcon size={14} />
              <span className='font-semibold'>{count}</span>
            </div>
          </Tag>
        );
      }
    },
    {
      title: 'Booking Time',
      dataIndex: 'booking_time',
      key: 'booking_time',
      width: 150,
      render: (value) => (
        <div className='flex flex-col gap-1'>
          <div>{dayjs(value).format(DateFormat.DATE_SLASH)}</div>
          <div className='text-gray-500'>{dayjs(value).format(DateFormat.TIME_24H)}</div>
        </div>
      )
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 130,
      align: 'right',
      render: (value) => <span className='font-semibold'>{value.toLocaleString('vi-VN')} đ</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (value: BookingStatus) => (
        <Tag color={getStatusColor(value)}>
          {value === BookingStatus.PENDING_PAYMENT ? 'PENDING PAYMENT' : value.toUpperCase()}
        </Tag>
      )
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
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space className='!gap-0'>
          {onViewDetail && (
            <Tooltip title='View Details'>
              <Button icon={<Eye size={20} />} type='text' size='large' onClick={() => onViewDetail(record)} />
            </Tooltip>
          )}
          {record.status === BookingStatus.PENDING_PAYMENT && onCreatePayment && (
            <Tooltip title='Create Payment'>
              <Button
                icon={<CreditCard size={20} />}
                type='text'
                size='large'
                className='text-green-600'
                onClick={() => onCreatePayment(record)}
              />
            </Tooltip>
          )}
          <EditButton onClick={() => onEdit(record)} />
          <ConfirmDeleteButton
            title='Are you sure you want to delete this booking? This will also delete all associated tickets.'
            onConfirm={() => onDelete(record)}
          />
        </Space>
      )
    }
  ];

  return { columns };
};

export default useColumn;
