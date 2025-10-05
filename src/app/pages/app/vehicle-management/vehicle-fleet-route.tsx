import { useVehicles } from '@app/features/vehicle-management/vehicle-fleet/api/get-vehicles.api';
import VehicleFormModal from '@app/features/vehicle-management/vehicle-fleet/components/vehicle-form-modal';
import VehicleList from '@app/features/vehicle-management/vehicle-fleet/components/vehicle-list';
import { useCreateVehicleForm } from '@app/features/vehicle-management/vehicle-fleet/hooks/use-create-vehicle-form';
import { useTableState } from '@app/hooks';
import { PageTitle, SearchInput } from '@app/shared/components';
import BoxLayout from '@app/shared/layouts/box-layout';
import Container from '@app/shared/layouts/container';
import { Button } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const VehicleFleetRoute = () => {
  const [open, setOpen] = useState(false);
  const { handleSubmit, form } = useCreateVehicleForm(setOpen);

  const { tableState, setSearch, setPage, setPageSize } = useTableState();

  const vehiclesQuery = useVehicles({
    params: {
      search: tableState.search,
      page: tableState.page,
      pageSize: tableState.pageSize
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

  return (
    <Container>
      <div className='flex items-center justify-between'>
        <PageTitle title='Vehicle Fleet' subTitle='Manage your fleet of vehicles' />
        <Button type='primary' size='large' icon={<Plus size={18} />} onClick={() => setOpen(true)}>
          Add Vehicle
        </Button>
        {open && <VehicleFormModal open={open} setOpen={setOpen} form={form} handleSubmit={handleSubmit} />}
      </div>

      <BoxLayout className='flex flex-col gap-6'>
        <SearchInput placeholder='Search vehicles...' handleSearch={(e) => handleSearch(e.target.value)} />
        <VehicleList vehiclesQuery={vehiclesQuery} onPaginationChange={handlePaginationChange} />
      </BoxLayout>
    </Container>
  );
};

export default VehicleFleetRoute;
