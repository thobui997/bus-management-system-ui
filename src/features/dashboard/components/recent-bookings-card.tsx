import { useRecentBookings } from '@app/features/dashboard/api/get-recent-bookings.api';
import dayjs from '@app/lib/date-utils';
import { DateFormat } from '@app/shared/contants';
import { Card, List, Spin, Tag, Typography } from 'antd';
import { BookingStatus } from '@app/features/booking/types/booking.type';

const { Text } = Typography;

const getStatusColor = (status: string) => {
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

const RecentBookingsCard = () => {
  const { data: bookings, isLoading } = useRecentBookings({ limit: 5 });

  return (
    <Card title='Recent Bookings' className='shadow-sm'>
      {isLoading ? (
        <div className='flex justify-center py-8'>
          <Spin />
        </div>
      ) : (
        <List
          dataSource={bookings}
          className='max-h-80 overflow-y-auto'
          renderItem={(booking) => (
            <List.Item>
              <div className='flex justify-between items-center w-full !px-2'>
                <div className='flex-1'>
                  <Text strong>#{booking.id}</Text>
                  <div className='text-sm text-gray-500'>{booking.customer_name}</div>
                  <div className='text-sm text-gray-500'>{booking.route_name}</div>
                  <div className='text-xs text-gray-400'>
                    {dayjs(booking.departure_time).format(DateFormat.DATE_TIME_SHORT)}
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-semibold text-green-600'>{booking.total_amount.toLocaleString('vi-VN')} đ</div>
                  <Tag color={getStatusColor(booking.status)} className='!mt-1 !mr-0'>
                    {booking.status === 'pendingPayment' ? 'PENDING' : booking.status.toUpperCase()}
                  </Tag>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default RecentBookingsCard;
