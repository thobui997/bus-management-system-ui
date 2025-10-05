import { useNotification } from '@app/context/notification-context';
import { useDeleteRoute } from '@app/features/route-management/api/delete-route.api';
import RouteFormModal from '@app/features/route-management/components/route-form-modal';
import useColumn from '@app/features/route-management/hooks/use-column';
import { useUpdateRouteForm } from '@app/features/route-management/hooks/use-update-route-form';
import { Route, RouteResponse } from '@app/features/route-management/types/route.type';
import { AppTable } from '@app/shared/components';
import { UseQueryResult } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { useState } from 'react';

type RouteListProps = {
  routesQuery: UseQueryResult<RouteResponse, Error>;
  onPaginationChange: (page: number, pageSize: number) => void;
  onManageStops: (route: Route) => void;
};

const RouteList = ({ routesQuery, onPaginationChange, onManageStops }: RouteListProps) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  const { showNotification } = useNotification();
  const { handleSubmit, form, handleSetFormValues } = useUpdateRouteForm(setOpen);
  const deleteMutation = useDeleteRoute({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Route deleted successfully');
      },
      onError: () => {
        showNotification('error', 'Failed to delete route');
      }
    }
  });

  const onEdit = (record: Route) => {
    setOpen(true);
    handleSetFormValues(record);
    setId(record.id);
  };

  const onDelete = (record: Route) => {
    deleteMutation.mutate(record.id);
  };

  const { columns } = useColumn({ onEdit, onDelete, onManageStops });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    onPaginationChange(pagination.current ?? 1, pagination.pageSize ?? 10);
  };

  const paginationConfig: TablePaginationConfig = {
    current: routesQuery.data?.page ?? 1,
    pageSize: routesQuery.data?.pageSize ?? 10,
    total: routesQuery.data?.total ?? 0,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    pageSizeOptions: ['10', '20', '50', '100']
  };

  return (
    <>
      <AppTable<Route>
        loading={routesQuery.isLoading}
        columns={columns}
        dataSource={routesQuery.data?.data ?? []}
        rowKey={(record) => record.id}
        pagination={paginationConfig}
        onChange={handleTableChange}
      />

      {open && (
        <RouteFormModal
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

export default RouteList;
