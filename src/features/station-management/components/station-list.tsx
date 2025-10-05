import { useNotification } from '@app/context/notification-context';
import { useDeleteStation } from '@app/features/station-management/api/delete-station.api';
import StationFormModal from '@app/features/station-management/components/station-form-modal';
import useColumn from '@app/features/station-management/hooks/use-column';
import { useUpdateStationForm } from '@app/features/station-management/hooks/use-update-station-form';
import { Station, StationResponse } from '@app/features/station-management/types/station.type';
import { AppTable } from '@app/shared/components';
import { UseQueryResult } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { useState } from 'react';

type StationListProps = {
  stationsQuery: UseQueryResult<StationResponse, Error>;
  onPaginationChange: (page: number, pageSize: number) => void;
};

const StationList = ({ stationsQuery, onPaginationChange }: StationListProps) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  const { showNotification } = useNotification();
  const { handleSubmit, form, handleSetFormValues } = useUpdateStationForm(setOpen);
  const deleteMutation = useDeleteStation({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Station deleted successfully');
      },
      onError: () => {
        showNotification('error', 'Failed to delete station');
      }
    }
  });

  const onEdit = (record: Station) => {
    setOpen(true);
    handleSetFormValues(record);
    setId(record.id);
  };

  const onDelete = (record: Station) => {
    deleteMutation.mutate(record.id);
  };

  const { columns } = useColumn({ onEdit, onDelete });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    onPaginationChange(pagination.current ?? 1, pagination.pageSize ?? 10);
  };

  const paginationConfig: TablePaginationConfig = {
    current: stationsQuery.data?.page ?? 1,
    pageSize: stationsQuery.data?.pageSize ?? 10,
    total: stationsQuery.data?.total ?? 0,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    pageSizeOptions: ['10', '20', '50', '100']
  };

  return (
    <>
      <AppTable<Station>
        loading={stationsQuery.isLoading}
        columns={columns}
        dataSource={stationsQuery.data?.data ?? []}
        rowKey={(record) => record.id}
        pagination={paginationConfig}
        onChange={handleTableChange}
      />

      {open && (
        <StationFormModal
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

export default StationList;
