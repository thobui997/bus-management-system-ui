import { useUpcomingTrips } from '@app/features/dashboard/api/get-upcoming-trips.api';
import { TripStatus } from '@app/features/trip-scheduling/types/trip.type';
import dayjs from '@app/lib/date-utils';
import { DateFormat } from '@app/shared/contants';
import { Card, List, Spin, Tag, Typography } from 'antd';

const { Text } = Typography;

const getStatusColor = (status: TripStatus | string): string => {
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

const UpcomingTripsCard = () => {
  const { data: trips = [], isLoading } = useUpcomingTrips({ limit: 5 });

  return (
    <Card title='Upcoming Trips' className='shadow-sm'>
      {isLoading ? (
        <div className='flex justify-center py-8'>
          <Spin />
        </div>
      ) : (
        <List
          dataSource={trips}
          locale={{ emptyText: 'No upcoming trips found' }}
          className='max-h-80 overflow-y-auto'
          renderItem={(trip) => (
            <List.Item>
              <div className='flex justify-between items-center w-full'>
                <div className='flex-1'>
                  <Text strong>{trip.route_name}</Text>
                  <div className='text-sm text-gray-500'>Vehicle: {trip.vehicle_license || 'N/A'}</div>
                  <div className='text-xs text-gray-400'>
                    Depart:{' '}
                    {trip.departure_time ? dayjs(trip.departure_time).format(DateFormat.DATE_TIME_SHORT) : 'N/A'}
                  </div>
                  <div className='text-xs text-gray-400'>
                    Arrive: {trip.arrival_time ? dayjs(trip.arrival_time).format(DateFormat.DATE_TIME_SHORT) : 'N/A'}
                  </div>
                </div>

                <Tag color={getStatusColor(trip.status)}>
                  {trip.status === TripStatus.ON_TIME ? 'ON TIME' : trip.status?.toString().toUpperCase()}
                </Tag>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default UpcomingTripsCard;
