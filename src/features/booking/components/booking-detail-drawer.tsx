import { useBookingDetail } from '@app/features/booking/api/get-booking-detail.api';
import { BookingStatus } from '@app/features/booking/types/booking.type';
import dayjs from '@app/lib/date-utils';
import { DateFormat } from '@app/shared/contants';
import { Card, Descriptions, Drawer, Space, Spin, Table, Tag } from 'antd';
import { Ticket } from 'lucide-react';

interface BookingDetailDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookingId: number;
}

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

const BookingDetailDrawer = ({ open, setOpen, bookingId }: BookingDetailDrawerProps) => {
  const bookingDetailQuery = useBookingDetail({ id: bookingId });

  const ticketColumns = [
    {
      title: '#',
      key: 'index',
      width: 50,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'Seat Number',
      dataIndex: 'seat_number',
      key: 'seat_number',
      width: 120
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      align: 'right' as const,
      render: (value: number) => <span className='font-semibold text-green-600'>{value.toLocaleString('vi-VN')} đ</span>
    },
    {
      title: 'QR Code',
      dataIndex: 'qrcode',
      key: 'qrcode',
      render: (value: string) => value || '-'
    }
  ];

  if (bookingDetailQuery.isLoading) {
    return (
      <Drawer title='Booking Details' open={open} onClose={() => setOpen(false)} width={800}>
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      </Drawer>
    );
  }

  const booking = bookingDetailQuery.data;

  return (
    <Drawer title='Booking Details' open={open} onClose={() => setOpen(false)} width={800}>
      <Space direction='vertical' size='large' className='w-full'>
        {/* Booking Information */}
        <Card title='Booking Information' size='small'>
          <Descriptions column={2} bordered size='small'>
            <Descriptions.Item label='Booking ID' span={2}>
              <span className='font-semibold'>#{booking?.id}</span>
            </Descriptions.Item>
            <Descriptions.Item label='Customer' span={2}>
              <div className='flex flex-col'>
                <span className='font-semibold'>{booking?.customer?.full_name}</span>
                <span className='text-gray-500 text-xs'>{booking?.customer?.email}</span>
                <span className='text-gray-500 text-xs'>{booking?.customer?.phone_number}</span>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label='Trip' span={2}>
              Trip #{booking?.trip?.id}
            </Descriptions.Item>
            <Descriptions.Item label='Booking Time'>
              {booking?.booking_time ? dayjs(booking.booking_time).format(DateFormat.DATE_TIME_SHORT) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label='Status'>
              <Tag color={getStatusColor(booking?.status || BookingStatus.PENDING_PAYMENT)}>
                {booking?.status === BookingStatus.PENDING_PAYMENT ? 'PENDING PAYMENT' : booking?.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Total Amount' span={2}>
              <span className='text-lg font-bold text-green-600'>
                {booking?.total_amount.toLocaleString('vi-VN')} đ
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Tickets Information */}
        <Card
          title={
            <Space>
              <Ticket size={20} />
              <span>Tickets ({booking?.tickets?.length || 0})</span>
            </Space>
          }
          size='small'
        >
          {booking?.tickets && booking.tickets.length > 0 ? (
            <>
              <Table
                columns={ticketColumns}
                dataSource={booking.tickets}
                rowKey='id'
                pagination={false}
                size='small'
                bordered
              />
              <div className='mt-4 p-3 bg-green-50 rounded flex justify-between items-center'>
                <span className='font-semibold'>Total:</span>
                <span className='text-xl font-bold text-green-600'>
                  {booking.tickets.reduce((sum, ticket) => sum + ticket.price, 0).toLocaleString('vi-VN')} đ
                </span>
              </div>
            </>
          ) : (
            <div className='text-center py-8 text-gray-500'>No tickets found</div>
          )}
        </Card>
      </Space>
    </Drawer>
  );
};

export default BookingDetailDrawer;
