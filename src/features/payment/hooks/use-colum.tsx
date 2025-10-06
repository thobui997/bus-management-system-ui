import { Payment, PaymentMethod, PaymentStatus } from '@app/features/payment/types/payment.type';
import dayjs from '@app/lib/date-utils';
import { ConfirmDeleteButton, EditButton } from '@app/shared/components';
import { DateFormat } from '@app/shared/contants';
import { Space, TableProps, Tag } from 'antd';

type UseColumnProps = {
  onEdit: (record: Payment) => void;
  onDelete: (record: Payment) => void;
};

const getStatusColor = (status: PaymentStatus) => {
  return status === PaymentStatus.SUCCESS ? 'green' : 'red';
};

const getMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CASH:
      return 'Cash';
    case PaymentMethod.E_WALLET:
      return 'E-Wallet';
    case PaymentMethod.BANK_TRANSFER:
      return 'Bank Transfer';
    default:
      return method;
  }
};

const useColumn = ({ onEdit, onDelete }: UseColumnProps) => {
  const columns: TableProps<Payment>['columns'] = [
    {
      title: 'Payment ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left'
    },
    {
      title: 'Booking',
      key: 'booking',
      width: 200,
      render: (_, record) => (
        <div className='flex flex-col'>
          <div className='font-semibold'>#{record.booking_id}</div>
          <div className='text-gray-500 text-xs'>{record.booking?.customer?.full_name}</div>
          <div className='text-gray-500 text-xs'>{record.booking?.customer?.email}</div>
        </div>
      )
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      width: 150,
      render: (value: PaymentMethod) => <Tag color='blue'>{getMethodLabel(value)}</Tag>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      align: 'right',
      render: (value) => <span className='font-semibold text-green-600'>{value.toLocaleString('vi-VN')} đ</span>
    },
    {
      title: 'Transaction Time',
      dataIndex: 'transaction_time',
      key: 'transaction_time',
      width: 180,
      render: (value) => (
        <div className='flex flex-col gap-1'>
          <div>{dayjs(value).format(DateFormat.DATE_SLASH)}</div>
          <div className='text-gray-500'>{dayjs(value).format(DateFormat.TIME_24H)}</div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: PaymentStatus) => <Tag color={getStatusColor(value)}>{value.toUpperCase()}</Tag>
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
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
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space className='!gap-0'>
          <EditButton onClick={() => onEdit(record)} />
          <ConfirmDeleteButton
            title='Are you sure you want to delete this payment?'
            onConfirm={() => onDelete(record)}
          />
        </Space>
      )
    }
  ];

  return { columns };
};

export default useColumn;
