import { useNotification } from '@app/context/notification-context';
import { useDeleteMaintenanceLog } from '@app/features/vehicle-management/vehicle-fleet/api/delete-maintenance-log.api';
import MaintenanceLogFormModal from '@app/features/vehicle-management/vehicle-fleet/components/maintenance-log-form-modal';
import useMaintenanceLogColumn from '@app/features/vehicle-management/vehicle-fleet/hooks/use-maintenance-log-column';
import { useUpdateMaintenanceLogForm } from '@app/features/vehicle-management/vehicle-fleet/hooks/use-update-maintenance-log-form';
import {
  MaintenanceLog,
  MaintenanceLogResponse
} from '@app/features/vehicle-management/vehicle-fleet/types/maintenance-log.type';
import { AppTable } from '@app/shared/components';
import { UseQueryResult } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { useState } from 'react';

type MaintenanceLogListProps = {
  maintenanceLogsQuery: UseQueryResult<MaintenanceLogResponse, Error>;
  onPaginationChange: (page: number, pageSize: number) => void;
};

const MaintenanceLogList = ({ maintenanceLogsQuery, onPaginationChange }: MaintenanceLogListProps) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  const { showNotification } = useNotification();
  const { handleSubmit, form, handleSetFormValues } = useUpdateMaintenanceLogForm(setOpen);
  const deleteMutation = useDeleteMaintenanceLog({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Maintenance log deleted successfully');
      },
      onError: () => {
        showNotification('error', 'Failed to delete maintenance log');
      }
    }
  });

  const onEdit = (record: MaintenanceLog) => {
    setOpen(true);
    handleSetFormValues(record);
    setId(record.id);
  };

  const onDelete = (record: MaintenanceLog) => {
    deleteMutation.mutate(record.id);
  };

  const { columns } = useMaintenanceLogColumn({ onEdit, onDelete });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    onPaginationChange(pagination.current ?? 1, pagination.pageSize ?? 10);
  };

  const paginationConfig: TablePaginationConfig = {
    current: maintenanceLogsQuery.data?.page ?? 1,
    pageSize: maintenanceLogsQuery.data?.pageSize ?? 10,
    total: maintenanceLogsQuery.data?.total ?? 0,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    pageSizeOptions: ['10', '20', '50', '100']
  };

  return (
    <>
      <AppTable<MaintenanceLog>
        loading={maintenanceLogsQuery.isLoading}
        columns={columns}
        dataSource={maintenanceLogsQuery.data?.data ?? []}
        rowKey={(record) => record.id}
        pagination={paginationConfig}
        onChange={handleTableChange}
      />

      {open && (
        <MaintenanceLogFormModal
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

export default MaintenanceLogList;
