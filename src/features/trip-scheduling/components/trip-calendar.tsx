import { useTrips } from '@app/features/trip-scheduling/api/get-trips.api';
import { Trip, TripStatus } from '@app/features/trip-scheduling/types/trip.type';
import { Badge, Calendar, Card, Modal, Tag, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from '@app/lib/date-utils';
import { useState } from 'react';

const { Text } = Typography;

const TripCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState<Trip[]>([]);

  const tripsQuery = useTrips({
    params: {
      pageSize: 1000,
      date: selectedDate.format('YYYY-MM')
    }
  });

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case TripStatus.ON_TIME:
        return 'success';
      case TripStatus.DELAYED:
        return 'warning';
      case TripStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getListData = (value: Dayjs) => {
    const trips = tripsQuery.data?.data.filter((trip) => {
      const tripDate = dayjs(trip.departure_time);
      return tripDate.date() === value.date() && tripDate.month() === value.month();
    });

    return trips || [];
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className='p-0 m-0 list-none'>
        {listData.slice(0, 3).map((item) => (
          <li key={item.id}>
            <Badge
              status={getStatusColor(item.status)}
              text={
                <span className='text-xs truncate block'>
                  {dayjs(item.departure_time).format('HH:mm')} - {item.route?.route_name}
                </span>
              }
            />
          </li>
        ))}
        {listData.length > 3 && <li className='text-xs text-gray-500'>+{listData.length - 3} more</li>}
      </ul>
    );
  };

  const onSelect = (date: Dayjs) => {
    const trips = getListData(date);
    if (trips.length > 0) {
      setSelectedTrips(trips);
      setModalVisible(true);
    }
  };

  return (
    <>
      <Card>
        <Calendar dateCellRender={dateCellRender} onSelect={onSelect} onChange={setSelectedDate} />
      </Card>

      <Modal
        title={`Trips on ${selectedDate.format('DD/MM/YYYY')}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <div className='flex flex-col gap-3'>
          {selectedTrips.map((trip) => (
            <Card key={trip.id} size='small'>
              <div className='flex justify-between items-center'>
                <div>
                  <Text strong>{trip.route?.route_name}</Text>
                  <div className='text-sm text-gray-500'>
                    {trip.route?.start_station?.station_name} → {trip.route?.end_station?.station_name}
                  </div>
                  <div className='text-sm'>
                    Departure: {dayjs(trip.departure_time).format('HH:mm')} - Arrival:{' '}
                    {dayjs(trip.arrival_time).format('HH:mm')}
                  </div>
                  <div className='text-sm'>
                    Vehicle: {trip.vehicle?.license_plate} ({trip.vehicle?.brand} {trip.vehicle?.model})
                  </div>
                </div>
                <Tag color={getStatusColor(trip.status)}>{trip.status.replace('_', ' ').toUpperCase()}</Tag>
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default TripCalendar;
