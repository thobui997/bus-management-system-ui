import { useMaintenanceLogs } from '@app/features/vehicle-management/vehicle-fleet/api/get-maintenance-logs.api';
import { useVehicles } from '@app/features/vehicle-management/vehicle-fleet/api/get-vehicles.api';
import MaintenanceLogFormModal from '@app/features/vehicle-management/vehicle-fleet/components/maintenance-log-form-modal';
import MaintenanceLogList from '@app/features/vehicle-management/vehicle-fleet/components/maintenance-log-list';
import VehicleFormModal from '@app/features/vehicle-management/vehicle-fleet/components/vehicle-form-modal';
import VehicleList from '@app/features/vehicle-management/vehicle-fleet/components/vehicle-list';
import { useCreateMaintenanceLogForm } from '@app/features/vehicle-management/vehicle-fleet/hooks/use-create-maintenance-log-form';
import { useCreateVehicleForm } from '@app/features/vehicle-management/vehicle-fleet/hooks/use-create-vehicle-form';
import { useTableState } from '@app/hooks';
import { PageTitle, SearchInput } from '@app/shared/components';
import BoxLayout from '@app/shared/layouts/box-layout';
import Container from '@app/shared/layouts/container';
import { Button, Tabs } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const VehicleFleetRoute = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [openVehicle, setOpenVehicle] = useState(false);
  const [openMaintenance, setOpenMaintenance] = useState(false);

  const { handleSubmit: handleVehicleSubmit, form: vehicleForm } = useCreateVehicleForm(setOpenVehicle);
  const { handleSubmit: handleMaintenanceSubmit, form: maintenanceForm } =
    useCreateMaintenanceLogForm(setOpenMaintenance);

  const {
    tableState: vehicleTableState,
    setSearch: setVehicleSearch,
    setPage: setVehiclePage,
    setPageSize: setVehiclePageSize
  } = useTableState();

  const {
    tableState: maintenanceTableState,
    setSearch: setMaintenanceSearch,
    setPage: setMaintenancePage,
    setPageSize: setMaintenancePageSize
  } = useTableState();

  const vehiclesQuery = useVehicles({
    params: {
      search: vehicleTableState.search,
      page: vehicleTableState.page,
      pageSize: vehicleTableState.pageSize
    }
  });

  const maintenanceLogsQuery = useMaintenanceLogs({
    params: {
      search: maintenanceTableState.search,
      page: maintenanceTableState.page,
      pageSize: maintenanceTableState.pageSize
    }
  });

  const handleVehicleSearch = (value: string) => {
    setVehicleSearch(value);
  };

  const handleMaintenanceSearch = (value: string) => {
    setMaintenanceSearch(value);
  };

  const handleVehiclePaginationChange = (page: number, pageSize: number) => {
    setVehiclePage(page);
    if (pageSize !== vehicleTableState.pageSize) {
      setVehiclePageSize(pageSize);
    }
  };

  const handleMaintenancePaginationChange = (page: number, pageSize: number) => {
    setMaintenancePage(page);
    if (pageSize !== maintenanceTableState.pageSize) {
      setMaintenancePageSize(pageSize);
    }
  };

  const tabItems = [
    {
      key: 'vehicles',
      label: 'Vehicles',
      children: (
        <BoxLayout className='flex flex-col gap-6'>
          <SearchInput placeholder='Search vehicles...' handleSearch={(e) => handleVehicleSearch(e.target.value)} />
          <VehicleList vehiclesQuery={vehiclesQuery} onPaginationChange={handleVehiclePaginationChange} />
        </BoxLayout>
      )
    },
    {
      key: 'maintenance',
      label: 'Maintenance Logs',
      children: (
        <BoxLayout className='flex flex-col gap-6'>
          <SearchInput
            placeholder='Search maintenance logs...'
            handleSearch={(e) => handleMaintenanceSearch(e.target.value)}
          />
          <MaintenanceLogList
            maintenanceLogsQuery={maintenanceLogsQuery}
            onPaginationChange={handleMaintenancePaginationChange}
          />
        </BoxLayout>
      )
    }
  ];

  return (
    <Container>
      <div className='flex items-center justify-between'>
        <PageTitle title='Vehicle Fleet' subTitle='Manage your fleet of vehicles and maintenance' />
        <Button
          type='primary'
          size='large'
          icon={<Plus size={18} />}
          onClick={() => {
            if (activeTab === 'vehicles') {
              setOpenVehicle(true);
            } else {
              setOpenMaintenance(true);
            }
          }}
        >
          {activeTab === 'vehicles' ? 'Add Vehicle' : 'Add Maintenance Log'}
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size='large' />

      {openVehicle && (
        <VehicleFormModal
          open={openVehicle}
          setOpen={setOpenVehicle}
          form={vehicleForm}
          handleSubmit={handleVehicleSubmit}
        />
      )}

      {openMaintenance && (
        <MaintenanceLogFormModal
          open={openMaintenance}
          setOpen={setOpenMaintenance}
          form={maintenanceForm}
          handleSubmit={handleMaintenanceSubmit}
        />
      )}
    </Container>
  );
};

export default VehicleFleetRoute;
