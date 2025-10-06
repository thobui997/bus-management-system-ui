import { useNotification } from '@app/context/notification-context';
import { useDeleteBooking } from '@app/features/booking/api/delete-booking.api';
import { useBookingDetail } from '@app/features/booking/api/get-booking-detail.api';
import BookingDetailDrawer from '@app/features/booking/components/booking-detail-drawer';
import BookingFormModal from '@app/features/booking/components/booking-form-modal';
import useColumn from '@app/features/booking/hooks/use-column';
import { useUpdateBookingForm } from '@app/features/booking/hooks/use-update-booking-form';
import { Booking, BookingResponse } from '@app/features/booking/types/booking.type';
import { AppTable } from '@app/shared/components';
import { UseQueryResult } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { useState, useEffect } from 'react';

type BookingListProps = {
  bookingsQuery: UseQueryResult<BookingResponse, Error>;
  onPaginationChange: (page: number, pageSize: number) => void;
  onCreatePayment?: (booking: Booking) => void;
};

const BookingList = ({ bookingsQuery, onPaginationChange, onCreatePayment }: BookingListProps) => {
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [id, setId] = useState(0);
  const [detailId, setDetailId] = useState(0);
  const [initialTickets, setInitialTickets] = useState<any[]>([]);

  const { showNotification } = useNotification();
  const { handleSubmit, form, handleSetFormValues, getInitialTickets } = useUpdateBookingForm(setOpen);

  const bookingDetailQuery = useBookingDetail({
    id,
    queryConfig: {
      enabled: open && id > 0
    }
  });

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

  useEffect(() => {
    if (bookingDetailQuery.data) {
      handleSetFormValues(bookingDetailQuery.data);
      setInitialTickets(getInitialTickets(bookingDetailQuery.data));
    }
  }, [bookingDetailQuery.data]);

  const onEdit = (record: Booking) => {
    setId(record.id);
    setOpen(true);
  };

  const onDelete = (record: Booking) => {
    deleteMutation.mutate(record.id);
  };

  const onViewDetail = (record: Booking) => {
    setDetailId(record.id);
    setDetailOpen(true);
  };

  const { columns } = useColumn({ onEdit, onDelete, onCreatePayment, onViewDetail });

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
          handleSubmit={async (tickets) => {
            await handleSubmit(id, tickets);
          }}
          mode='edit'
          initialTickets={initialTickets}
        />
      )}

      {detailOpen && <BookingDetailDrawer open={detailOpen} setOpen={setDetailOpen} bookingId={detailId} />}
    </>
  );
};

export default BookingList;
