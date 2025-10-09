import { useRoutes } from '@app/features/route-management/api/get-routes.api';
import { useTrips } from '@app/features/trip-scheduling/api/get-trips.api';
import { Trip, TripStatus } from '@app/features/trip-scheduling/types/trip.type';
import { useVehicles } from '@app/features/vehicle-management/vehicle-fleet/api/get-vehicles.api';
import dayjs from '@app/lib/date-utils';
import { DateFormat } from '@app/shared/contants';
import { Badge, Button, Calendar, Card, Descriptions, Divider, Modal, Select, Space, Tag, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import { AlertCircle, Bus, Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react';
import { useState } from 'react';

const { Text } = Typography;

const TripCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState<Trip[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<TripStatus | undefined>();
  const [routeFilter, setRouteFilter] = useState<number | undefined>();
  const [vehicleFilter, setVehicleFilter] = useState<number | undefined>();

  const routesQuery = useRoutes({ params: { pageSize: 100 } });
  const vehiclesQuery = useVehicles({ params: { pageSize: 100 } });

  const tripsQuery = useTrips({
    params: {
      pageSize: 1000,
      date: currentMonth.format('YYYY-MM'),
      status: statusFilter,
      route_id: routeFilter,
      vehicle_id: vehicleFilter
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

  const getStatusText = (status: TripStatus) => {
    switch (status) {
      case TripStatus.ON_TIME:
        return 'On Time';
      case TripStatus.DELAYED:
        return 'Delayed';
      case TripStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getListData = (value: Dayjs) => {
    const trips = tripsQuery.data?.data.filter((trip) => {
      const tripDate = dayjs(trip.departure_time);
      return tripDate.date() === value.date() && tripDate.month() === value.month() && tripDate.year() === value.year();
    });

    return trips || [];
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);

    if (listData.length === 0) return null;

    // Count trips by status
    const onTimeCount = listData.filter((t) => t.status === TripStatus.ON_TIME).length;
    const delayedCount = listData.filter((t) => t.status === TripStatus.DELAYED).length;
    const cancelledCount = listData.filter((t) => t.status === TripStatus.CANCELLED).length;

    return (
      <div className='flex flex-col gap-1'>
        {/* Display first 2 trips */}
        {listData.slice(0, 2).map((item) => (
          <div key={item.id} className='text-xs truncate'>
            <Badge status={getStatusColor(item.status)} />
            <span className='ml-1'>
              {dayjs(item.departure_time).format('HH:mm')} - {item.route?.route_name}
            </span>
          </div>
        ))}

        {/* Show count if more than 2 trips */}
        {listData.length > 2 && <div className='text-xs text-gray-500 font-medium'>+{listData.length - 2} more</div>}

        {/* Status summary badges */}
        <div className='flex gap-1 mt-1'>
          {onTimeCount > 0 && (
            <Tag color='green' className='!text-xs !m-0 !px-1 !py-0'>
              {onTimeCount}
            </Tag>
          )}
          {delayedCount > 0 && (
            <Tag color='orange' className='!text-xs !m-0 !px-1 !py-0'>
              {delayedCount}
            </Tag>
          )}
          {cancelledCount > 0 && (
            <Tag color='red' className='!text-xs !m-0 !px-1 !py-0'>
              {cancelledCount}
            </Tag>
          )}
        </div>
      </div>
    );
  };

  const onSelect = (date: Dayjs) => {
    const trips = getListData(date);
    if (trips.length > 0) {
      setSelectedDate(date);
      setSelectedTrips(trips);
      setModalVisible(true);
    }
  };

  const onPanelChange = (value: Dayjs) => {
    setCurrentMonth(value);
  };

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setDetailModalVisible(true);
  };

  const handleClearFilters = () => {
    setStatusFilter(undefined);
    setRouteFilter(undefined);
    setVehicleFilter(undefined);
  };

  return (
    <div className='flex flex-col gap-4 h-full'>
      {/* Filters */}
      <Card size='small' className='mb-4'>
        <Space wrap>
          <Select
            placeholder='Filter by status'
            allowClear
            style={{ width: 180 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'On Time', value: TripStatus.ON_TIME },
              { label: 'Delayed', value: TripStatus.DELAYED },
              { label: 'Cancelled', value: TripStatus.CANCELLED }
            ]}
          />

          <Select
            placeholder='Filter by route'
            allowClear
            showSearch
            style={{ width: 250 }}
            value={routeFilter}
            loading={routesQuery.isLoading}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            onChange={setRouteFilter}
            options={routesQuery.data?.data.map((route) => ({
              label: route.route_name,
              value: route.id
            }))}
          />

          <Select
            placeholder='Filter by vehicle'
            allowClear
            showSearch
            style={{ width: 200 }}
            value={vehicleFilter}
            loading={vehiclesQuery.isLoading}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            onChange={setVehicleFilter}
            options={vehiclesQuery.data?.data.map((vehicle) => ({
              label: vehicle.license_plate,
              value: vehicle.id
            }))}
          />

          {(statusFilter || routeFilter || vehicleFilter) && (
            <Button onClick={handleClearFilters}>Clear Filters</Button>
          )}
        </Space>
      </Card>

      {/* Calendar */}
      <Card className='flex-1 overflow-y-auto'>
        <Calendar cellRender={dateCellRender} onSelect={onSelect} onPanelChange={onPanelChange} value={currentMonth} />
      </Card>

      {/* Trips List Modal */}
      <Modal
        title={
          <Space>
            <CalendarIcon size={20} />
            <span>Trips on {selectedDate.format('DD/MM/YYYY')}</span>
            <Tag color='blue'>{selectedTrips.length} trips</Tag>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
      >
        <div className='flex flex-col gap-3'>
          {selectedTrips.map((trip) => (
            <Card
              key={trip.id}
              size='small'
              hoverable
              onClick={() => handleTripClick(trip)}
              className='cursor-pointer hover:border-blue-400'
            >
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <MapPin size={16} className='text-blue-600' />
                    <Text strong className='text-base'>
                      {trip.route?.route_name}
                    </Text>
                    <Tag color={getStatusColor(trip.status)}>{getStatusText(trip.status)}</Tag>
                  </div>

                  <div className='flex flex-col gap-1 text-sm text-gray-600'>
                    <div className='flex items-center gap-2'>
                      <Tag color='green' className='!m-0'>
                        From
                      </Tag>
                      <span>{trip.route?.start_station?.station_name}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Tag color='red' className='!m-0'>
                        To
                      </Tag>
                      <span>{trip.route?.end_station?.station_name}</span>
                    </div>
                  </div>

                  <Divider className='!my-2' />

                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div className='flex items-center gap-2'>
                      <Clock size={14} className='text-gray-500' />
                      <span>Departure: {dayjs(trip.departure_time).format(DateFormat.TIME_24H)}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Clock size={14} className='text-gray-500' />
                      <span>Arrival: {dayjs(trip.arrival_time).format(DateFormat.TIME_24H)}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Bus size={14} className='text-gray-500' />
                      <span>
                        {trip.vehicle?.license_plate} ({trip.vehicle?.brand} {trip.vehicle?.model})
                      </span>
                    </div>
                    {trip.trip_assignments && trip.trip_assignments.length > 0 && (
                      <div className='flex items-center gap-2'>
                        <User size={14} className='text-gray-500' />
                        <span>{trip.trip_assignments.length} assigned</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Modal>

      {/* Trip Detail Modal */}
      <Modal
        title={
          <Space>
            <MapPin size={20} />
            <span>Trip Details #{selectedTrip?.id}</span>
            {selectedTrip && (
              <Tag color={getStatusColor(selectedTrip.status)}>{getStatusText(selectedTrip.status)}</Tag>
            )}
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTrip && (
          <div className='flex flex-col gap-4'>
            {/* Route Information */}
            <Card title='Route Information' size='small'>
              <Descriptions column={2} bordered size='small'>
                <Descriptions.Item label='Route Name' span={2}>
                  <Text strong>{selectedTrip.route?.route_name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label='From'>
                  <Tag color='green'>{selectedTrip.route?.start_station?.station_name}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label='To'>
                  <Tag color='red'>{selectedTrip.route?.end_station?.station_name}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Schedule Information */}
            <Card title='Schedule' size='small'>
              <Descriptions column={2} bordered size='small'>
                <Descriptions.Item label='Departure Time'>
                  <Space>
                    <Clock size={14} />
                    <span>{dayjs(selectedTrip.departure_time).format(DateFormat.DATE_TIME_SHORT)}</span>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='Arrival Time'>
                  <Space>
                    <Clock size={14} />
                    <span>{dayjs(selectedTrip.arrival_time).format(DateFormat.DATE_TIME_SHORT)}</span>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label='Duration' span={2}>
                  {(() => {
                    const duration = dayjs(selectedTrip.arrival_time).diff(
                      dayjs(selectedTrip.departure_time),
                      'minute'
                    );
                    const hours = Math.floor(duration / 60);
                    const minutes = duration % 60;
                    return (
                      <Tag color='blue'>
                        {hours}h {minutes}m
                      </Tag>
                    );
                  })()}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            {/* Vehicle Information */}
            <Card title='Vehicle' size='small'>
              <Descriptions column={2} bordered size='small'>
                <Descriptions.Item label='License Plate'>
                  <Tag color='blue'>{selectedTrip.vehicle?.license_plate}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Vehicle'>
                  {selectedTrip.vehicle?.brand} {selectedTrip.vehicle?.model}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Assignments */}
            {selectedTrip.trip_assignments && selectedTrip.trip_assignments.length > 0 && (
              <Card title='Assignments' size='small'>
                <div className='flex flex-col gap-2'>
                  {selectedTrip.trip_assignments.map((assignment) => (
                    <Card key={assignment.id} size='small' className='bg-gray-50'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <User size={16} />
                          <Text strong>{assignment.employee?.full_name}</Text>
                        </div>
                        <Tag color={assignment.role_in_trip === 'driver' ? 'blue' : 'green'}>
                          {assignment.role_in_trip.toUpperCase()}
                        </Tag>
                      </div>
                      {assignment.employee?.phone_number && (
                        <Text className='text-xs text-gray-500'>{assignment.employee.phone_number}</Text>
                      )}
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* Status Warning */}
            {selectedTrip.status === TripStatus.DELAYED && (
              <Card size='small' className='bg-orange-50 border-orange-200'>
                <Space>
                  <AlertCircle size={16} className='text-orange-600' />
                  <Text className='text-orange-800'>This trip is delayed</Text>
                </Space>
              </Card>
            )}

            {selectedTrip.status === TripStatus.CANCELLED && (
              <Card size='small' className='bg-red-50 border-red-200'>
                <Space>
                  <AlertCircle size={16} className='text-red-600' />
                  <Text className='text-red-800'>This trip has been cancelled</Text>
                </Space>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
export default TripCalendar;
