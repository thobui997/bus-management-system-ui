import { useNotification } from '@app/context/notification-context';
import { useDeleteVehicle } from '@app/features/vehicle-management/vehicle-fleet/api/delete-vehicle.api';
import VehicleFormModal from '@app/features/vehicle-management/vehicle-fleet/components/vehicle-form-modal';
import useColumn from '@app/features/vehicle-management/vehicle-fleet/hooks/use-column';
import { useUpdateVehicleForm } from '@app/features/vehicle-management/vehicle-fleet/hooks/use-update-vehicle-form';
import { Vehicle, VehicleResponse } from '@app/features/vehicle-management/vehicle-fleet/types/vehicle.type';
import { AppTable } from '@app/shared/components';
import { UseQueryResult } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { useState } from 'react';

type VehicleListProps = {
  vehiclesQuery: UseQueryResult<VehicleResponse, Error>;
  onPaginationChange: (page: number, pageSize: number) => void;
};

const VehicleList = ({ vehiclesQuery, onPaginationChange }: VehicleListProps) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  const { showNotification } = useNotification();
  const { handleSubmit, form, handleSetFormValues } = useUpdateVehicleForm(setOpen);
  const deleteMutation = useDeleteVehicle({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Vehicle deleted successfully');
      },
      onError: () => {
        showNotification('error', 'Failed to delete vehicle');
      }
    }
  });

  const onEdit = (record: Vehicle) => {
    setOpen(true);
    handleSetFormValues(record);
    setId(record.id);
  };

  const onDelete = (record: Vehicle) => {
    deleteMutation.mutate(record.id);
  };

  const { columns } = useColumn({ onEdit, onDelete });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    onPaginationChange(pagination.current ?? 1, pagination.pageSize ?? 10);
  };

  const paginationConfig: TablePaginationConfig = {
    current: vehiclesQuery.data?.page ?? 1,
    pageSize: vehiclesQuery.data?.pageSize ?? 10,
    total: vehiclesQuery.data?.total ?? 0,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    pageSizeOptions: ['10', '20', '50', '100']
  };

  return (
    <>
      <AppTable<Vehicle>
        loading={vehiclesQuery.isLoading}
        columns={columns}
        dataSource={vehiclesQuery.data?.data ?? []}
        rowKey={(record) => record.id}
        pagination={paginationConfig}
        onChange={handleTableChange}
      />

      {open && (
        <VehicleFormModal
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

export default VehicleList;
