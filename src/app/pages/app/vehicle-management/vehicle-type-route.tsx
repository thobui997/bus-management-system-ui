import { useVehicleTypes } from '@app/features/vehicle-management/api/get-vehicle-types.api';
import VehicleTypeFormModal from '@app/features/vehicle-management/components/vehicle-type-form-modal';
import VehicleTypeList from '@app/features/vehicle-management/components/vehicle-type-list';
import { useCreateVehicleTypeForm } from '@app/features/vehicle-management/hooks/use-create-vehicle-type-form';
import { PageTitle, SearchInput } from '@app/shared/components';
import BoxLayout from '@app/shared/layouts/box-layout';
import Container from '@app/shared/layouts/Container';
import { Button } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const VehicleTypeRoute = () => {
  const [open, setOpen] = useState(false);
  const { handleSubmit, form } = useCreateVehicleTypeForm(setOpen);
  const vehicleTypesQuery = useVehicleTypes();

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
        <SearchInput placeholder='Search vehicle type' handleSearch={() => {}} />
        <VehicleTypeList vehicleTypesQuery={vehicleTypesQuery} />
      </BoxLayout>
    </Container>
  );
};

export default VehicleTypeRoute;
