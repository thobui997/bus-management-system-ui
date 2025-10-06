import { useNotification } from '@app/context/notification-context';
import { useDeleteTrip } from '@app/features/trip-scheduling/api/delete-trip.api';
import TripFormModal from '@app/features/trip-scheduling/components/trip-form-modal';
import TripAssignmentModal from '@app/features/trip-scheduling/components/trip-assignment-modal';
import useColumn from '@app/features/trip-scheduling/hooks/use-column';
import { useUpdateTripForm } from '@app/features/trip-scheduling/hooks/use-update-trip-form';
import { Trip, TripResponse } from '@app/features/trip-scheduling/types/trip.type';
import { AppTable } from '@app/shared/components';
import { UseQueryResult } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { useState } from 'react';

type TripListProps = {
  tripsQuery: UseQueryResult<TripResponse, Error>;
  onPaginationChange: (page: number, pageSize: number) => void;
};

const TripList = ({ tripsQuery, onPaginationChange }: TripListProps) => {
  const [open, setOpen] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [id, setId] = useState(0);
  const [selectedTripId, setSelectedTripId] = useState<number>(0);

  const { showNotification } = useNotification();
  const { handleSubmit, form, handleSetFormValues } = useUpdateTripForm(setOpen);
  const deleteMutation = useDeleteTrip({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Trip deleted successfully');
      },
      onError: () => {
        showNotification('error', 'Failed to delete trip');
      }
    }
  });

  const onEdit = (record: Trip) => {
    setOpen(true);
    handleSetFormValues(record);
    setId(record.id);
  };

  const onDelete = (record: Trip) => {
    deleteMutation.mutate(record.id);
  };

  const onManageAssignments = (record: Trip) => {
    setSelectedTripId(record.id);
    setAssignmentModalOpen(true);
  };

  const { columns } = useColumn({ onEdit, onDelete, onManageAssignments });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    onPaginationChange(pagination.current ?? 1, pagination.pageSize ?? 10);
  };

  const paginationConfig: TablePaginationConfig = {
    current: tripsQuery.data?.page ?? 1,
    pageSize: tripsQuery.data?.pageSize ?? 10,
    total: tripsQuery.data?.total ?? 0,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    pageSizeOptions: ['10', '20', '50', '100']
  };

  return (
    <>
      <AppTable<Trip>
        loading={tripsQuery.isLoading}
        columns={columns}
        dataSource={tripsQuery.data?.data ?? []}
        rowKey={(record) => record.id}
        pagination={paginationConfig}
        onChange={handleTableChange}
      />

      {open && (
        <TripFormModal
          open={open}
          setOpen={setOpen}
          form={form}
          handleSubmit={async () => {
            await handleSubmit(id);
          }}
          mode='edit'
        />
      )}

      {assignmentModalOpen && (
        <TripAssignmentModal open={assignmentModalOpen} setOpen={setAssignmentModalOpen} tripId={selectedTripId} />
      )}
    </>
  );
};

export default TripList;
