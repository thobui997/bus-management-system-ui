import VehicleTypeFormModal from '@app/features/vehicle-management/components/vehicle-type-form-modal';
import useColumn from '@app/features/vehicle-management/hooks/use-column';
import { useUpdateVehicleTypeForm } from '@app/features/vehicle-management/hooks/use-update-vehicle-type-form';
import { VehicleType } from '@app/features/vehicle-management/types/vehicle-type.type';
import { AppTable } from '@app/shared/components';
import { UseQueryResult } from '@tanstack/react-query';
import { useState } from 'react';

type VehicleTypeListProps = {
  vehicleTypesQuery: UseQueryResult<VehicleType[], Error>;
};

const VehicleTypeList = ({ vehicleTypesQuery }: VehicleTypeListProps) => {
  const [open, setOpen] = useState(false);
  const { handleSubmit, form, handleSetFormValues } = useUpdateVehicleTypeForm(setOpen);

  const onEdit = (record: VehicleType) => {
    setOpen(true);
    handleSetFormValues(record);
  };

  const { columns } = useColumn({ onEdit });

  return (
    <>
      <AppTable<VehicleType>
        loading={vehicleTypesQuery.isLoading}
        columns={columns}
        dataSource={vehicleTypesQuery.data ?? []}
        rowKey={(record) => record.id}
      />

      {open && (
        <VehicleTypeFormModal open={open} setOpen={setOpen} form={form} handleSubmit={handleSubmit} mode='edit' />
      )}
    </>
  );
};

export default VehicleTypeList;
