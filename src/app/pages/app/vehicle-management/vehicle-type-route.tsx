
import VehicleTypeFormModal from '@app/features/vehicle-management/components/vehicle-type-form-modal';
import VehicleTypeList from '@app/features/vehicle-management/components/vehicle-type-list';
import { useVehicleTypes } from '@app/features/vehicle-management/vehicle-type/api/get-vehicle-types.api';
import { useCreateVehicleTypeForm } from '@app/features/vehicle-management/vehicle-type/hooks/use-create-vehicle-type-form';
import { useTableState } from '@app/hooks';
import { PageTitle, SearchInput } from '@app/shared/components';
import BoxLayout from '@app/shared/layouts/box-layout';
import Container from '@app/shared/layouts/Container';
import { Button } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const VehicleTypeRoute = () => {
  const [open, setOpen] = useState(false);
  const { handleSubmit, form } = useCreateVehicleTypeForm(setOpen);

  const { tableState, setSearch, setPage, setPageSize } = useTableState();

  const vehicleTypesQuery = useVehicleTypes({
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
        <PageTitle title='Vehicle Types' />
        <Button type='primary' size='large' icon={<Plus size={18} />} onClick={() => setOpen(true)}>
          Add Vehicle Type
        </Button>
        {open && <VehicleTypeFormModal open={open} setOpen={setOpen} form={form} handleSubmit={handleSubmit} />}
      </div>

      <BoxLayout className='flex flex-col gap-6'>
        <SearchInput placeholder='Search vehicle type' handleSearch={(e) => handleSearch(e.target.value)} />
        <VehicleTypeList vehicleTypesQuery={vehicleTypesQuery} onPaginationChange={handlePaginationChange} />
      </BoxLayout>
    </Container>
  );
};

export default VehicleTypeRoute;
