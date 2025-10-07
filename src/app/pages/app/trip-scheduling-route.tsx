import { useTrips } from '@app/features/trip-scheduling/api/get-trips.api';
import TripFormModal from '@app/features/trip-scheduling/components/trip-form-modal';
import TripList from '@app/features/trip-scheduling/components/trip-list';
import TripCalendar from '@app/features/trip-scheduling/components/trip-calendar';
import { useCreateTripForm } from '@app/features/trip-scheduling/hooks/use-create-trip-form';
import { TripStatus } from '@app/features/trip-scheduling/types/trip.type';
import { useTableState } from '@app/hooks';
import { PageTitle, SearchInput } from '@app/shared/components';
import BoxLayout from '@app/shared/layouts/box-layout';
import Container from '@app/shared/layouts/container';
import { Button, Select, Space, Tabs } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useRoutes } from '@app/features/route-management/api/get-routes.api';
import { useVehicles } from '@app/features/vehicle-management/vehicle-fleet/api/get-vehicles.api';
import TabLayout from '@app/shared/layouts/tab-layout/tab-layout';

const TripSchedulingRoute = () => {
  const [activeTab, setActiveTab] = useState('trips');
  const [open, setOpen] = useState(false);

  // Filters
  const [tripStatus, setTripStatus] = useState<TripStatus | undefined>();
  const [routeId, setRouteId] = useState<number | undefined>();
  const [vehicleId, setVehicleId] = useState<number | undefined>();

  const { handleSubmit, form } = useCreateTripForm(setOpen);

  const { tableState, setSearch, setPage, setPageSize } = useTableState();

  const routesQuery = useRoutes({ params: { pageSize: 100 } });
  const vehiclesQuery = useVehicles({ params: { pageSize: 100 } });

  const tripsQuery = useTrips({
    params: {
      search: tableState.search,
      page: tableState.page,
      pageSize: tableState.pageSize,
      status: tripStatus,
      route_id: routeId,
      vehicle_id: vehicleId
    }
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    if (pageSize !== tableState.pageSize) {
      setPageSize(pageSize);
    }
  };

  const TripFilters = () => (
    <Space size='large'>
      <Select
        size='large'
        placeholder='Filter by status'
        allowClear
        style={{ width: 150 }}
        onChange={setTripStatus}
        options={[
          { label: 'On Time', value: TripStatus.ON_TIME },
          { label: 'Delayed', value: TripStatus.DELAYED },
          { label: 'Cancelled', value: TripStatus.CANCELLED }
        ]}
      />
      <Select
        size='large'
        placeholder='Filter by route'
        allowClear
        showSearch
        style={{ width: 250 }}
        loading={routesQuery.isLoading}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        onChange={setRouteId}
        options={routesQuery.data?.data.map((route) => ({
          label: route.route_name,
          value: route.id
        }))}
      />
      <Select
        size='large'
        placeholder='Filter by vehicle'
        allowClear
        showSearch
        style={{ width: 200 }}
        loading={vehiclesQuery.isLoading}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        onChange={setVehicleId}
        options={vehiclesQuery.data?.data.map((vehicle) => ({
          label: vehicle.license_plate,
          value: vehicle.id
        }))}
      />
    </Space>
  );

  const tabItems = [
    {
      key: 'trips',
      label: 'Trip List',
      children: (
        <BoxLayout className='flex flex-col gap-6 h-full'>
          <div className='flex items-center justify-between gap-4'>
            <SearchInput placeholder='Search trips...' handleSearch={(e) => handleSearch(e.target.value)} />
            <TripFilters />
          </div>
          <TripList tripsQuery={tripsQuery} onPaginationChange={handlePaginationChange} />
        </BoxLayout>
      )
    },
    {
      key: 'calendar',
      label: 'Calendar View',
      children: (
        <BoxLayout className='h-full'>
          <TripCalendar />
        </BoxLayout>
      )
    }
  ];

  return (
    <Container>
      <div className='flex items-center justify-between'>
        <PageTitle title='Trip Scheduling' subTitle='Manage trips and assignments' />
        {activeTab === 'trips' && (
          <Button type='primary' size='large' icon={<Plus size={18} />} onClick={() => setOpen(true)}>
            Add Trip
          </Button>
        )}
      </div>

      <TabLayout activeKey={activeTab} onChange={setActiveTab} items={tabItems} size='large' />

      {open && <TripFormModal open={open} setOpen={setOpen} form={form} handleSubmit={handleSubmit} />}
    </Container>
  );
};

export default TripSchedulingRoute;
