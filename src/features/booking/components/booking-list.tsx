import { useNotification } from '@app/context/notification-context';
import { useDeleteBooking } from '@app/features/booking/api/delete-booking.api';
import BookingFormModal from '@app/features/booking/components/booking-form-modal';
import useColumn from '@app/features/booking/hooks/use-column';
import { useUpdateBookingForm } from '@app/features/booking/hooks/use-update-booking-form';
import { Booking, BookingResponse } from '@app/features/booking/types/booking.type';
import { AppTable } from '@app/shared/components';
import { UseQueryResult } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { useState } from 'react';

type BookingListProps = {
  bookingsQuery: UseQueryResult<BookingResponse, Error>;
  onPaginationChange: (page: number, pageSize: number) => void;
};

const BookingList = ({ bookingsQuery, onPaginationChange }: BookingListProps) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  const { showNotification } = useNotification();
  const { handleSubmit, form, handleSetFormValues } = useUpdateBookingForm(setOpen);
  const deleteMutation = useDeleteBooking({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Booking deleted successfully');
      },
      onError: () => {
        showNotification('error', 'Failed to delete booking');
      }
    }
  });

  const onEdit = (record: Booking) => {
    setOpen(true);
    handleSetFormValues(record);
    setId(record.id);
  };

  const onDelete = (record: Booking) => {
    deleteMutation.mutate(record.id);
  };

  const { columns } = useColumn({ onEdit, onDelete });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    onPaginationChange(pagination.current ?? 1, pagination.pageSize ?? 10);
  };

  const paginationConfig: TablePaginationConfig = {
    current: bookingsQuery.data?.page ?? 1,
    pageSize: bookingsQuery.data?.pageSize ?? 10,
    total: bookingsQuery.data?.total ?? 0,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    pageSizeOptions: ['10', '20', '50', '100']
  };

  return (
    <>
      <AppTable<Booking>
        loading={bookingsQuery.isLoading}
        columns={columns}
        dataSource={bookingsQuery.data?.data ?? []}
        rowKey={(record) => record.id}
        pagination={paginationConfig}
        onChange={handleTableChange}
      />

      {open && (
        <BookingFormModal
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

export default BookingList;
