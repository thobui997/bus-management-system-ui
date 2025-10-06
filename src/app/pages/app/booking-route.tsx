import { useBookings } from '@app/features/booking/api/get-bookings.api';
import BookingFilter from '@app/features/booking/components/booking-filter';
import BookingFormModal from '@app/features/booking/components/booking-form-modal';
import BookingList from '@app/features/booking/components/booking-list';
import BookingTicketsModal from '@app/features/booking/components/booking-tickets-modal';
import { useCreateBookingForm } from '@app/features/booking/hooks/use-create-booking-form';
import { Booking, BookingStatus } from '@app/features/booking/types/booking.type';
import PaymentFormModal from '@app/features/payment/components/payment-form-modal';
import { useCreatePaymentForm } from '@app/features/payment/hooks/use-create-payment-form';
import { PaymentMethod, PaymentStatus } from '@app/features/payment/types/payment.type';
import { useTableState } from '@app/hooks';
import dayjs from '@app/lib/date-utils';
import { PageTitle, SearchInput } from '@app/shared/components';
import BoxLayout from '@app/shared/layouts/box-layout';
import Container from '@app/shared/layouts/container';
import { Button } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const BookingRoute = () => {
  const [open, setOpen] = useState(false);
  const [ticketsModalOpen, setTicketsModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number>(0);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | undefined>();

  const { handleSubmit, form } = useCreateBookingForm(setOpen);
  const { handleSubmit: handlePaymentSubmit, form: paymentForm } = useCreatePaymentForm(setPaymentModalOpen);
  const { tableState, setSearch, setPage, setPageSize } = useTableState();

  const bookingsQuery = useBookings({
    params: {
      search: tableState.search,
      page: tableState.page,
      pageSize: tableState.pageSize,
      status: bookingStatus
    }
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    if (pageSize !== tableState.pageSize) {
      setPageSize(pageSize);
    }
  };

  const handleManageTickets = (booking: Booking) => {
    setSelectedBookingId(booking.id);
    setTicketsModalOpen(true);
  };

  const handleCreatePayment = (booking: Booking) => {
    setSelectedBookingId(booking.id);
    paymentForm.setFieldsValue({
      booking_id: booking.id,
      amount: booking.total_amount,
      payment_method: PaymentMethod.CASH,
      transaction_time: dayjs(),
      status: PaymentStatus.SUCCESS
    });
    setPaymentModalOpen(true);
  };

  return (
    <Container>
      <div className='flex items-center justify-between'>
        <PageTitle title='Booking Management' subTitle='Manage customer bookings and tickets' />
        <Button type='primary' size='large' icon={<Plus size={18} />} onClick={() => setOpen(true)}>
          Add Booking
        </Button>
      </div>

      <BoxLayout className='flex flex-col gap-6'>
        <div className='flex items-center justify-between gap-4'>
          <SearchInput placeholder='Search bookings...' handleSearch={(e) => handleSearch(e.target.value)} />
          <BookingFilter onStatusChange={setBookingStatus} />
        </div>
        <BookingList
          bookingsQuery={bookingsQuery}
          onPaginationChange={handlePaginationChange}
          onManageTickets={handleManageTickets}
          onCreatePayment={handleCreatePayment}
        />
      </BoxLayout>

      {open && <BookingFormModal open={open} setOpen={setOpen} form={form} handleSubmit={handleSubmit} />}

      {ticketsModalOpen && (
        <BookingTicketsModal open={ticketsModalOpen} setOpen={setTicketsModalOpen} bookingId={selectedBookingId} />
      )}

      {paymentModalOpen && (
        <PaymentFormModal
          open={paymentModalOpen}
          setOpen={setPaymentModalOpen}
          form={paymentForm}
          handleSubmit={handlePaymentSubmit}
        />
      )}
    </Container>
  );
};

export default BookingRoute;
