import { useNotification } from '@app/context/notification-context';
import { useDeleteVehicleType } from '@app/features/vehicle-management/api/delete-vehicle-type.api';
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
  const [id, setId] = useState(0);

  const { showNotification } = useNotification();
  const { handleSubmit, form, handleSetFormValues } = useUpdateVehicleTypeForm(setOpen);
  const deleteMutation = useDeleteVehicleType({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Vehicle type deleted successfully');
      },
      onError: () => {
        showNotification('error', 'Failed to delete vehicle type');
      }
    }
  });

  const onEdit = (record: VehicleType) => {
    setOpen(true);
    handleSetFormValues(record);
    setId(record.id);
  };

  const onDelete = (record: VehicleType) => {
    deleteMutation.mutate(record.id);
  };

  const { columns } = useColumn({ onEdit, onDelete });

  return (
    <>
      <AppTable<VehicleType>
        loading={vehicleTypesQuery.isLoading}
        columns={columns}
        dataSource={vehicleTypesQuery.data ?? []}
        rowKey={(record) => record.id}
      />

      {open && (
        <VehicleTypeFormModal
          open={open}
          setOpen={setOpen}
          form={form}
          handleSubmit={async () => {
            await handleSubmit(id);
          }}
          mode='edit'
        />
      )}
    </>
  );
};

export default VehicleTypeList;
