import { useNotification } from '@app/context/notification-context';
import { useUpdateBooking } from '@app/features/booking/api/update-booking.api';
import { useManageTickets } from '@app/features/booking/api/manage-tickets.api';
import { Booking, TicketFormValues } from '@app/features/booking/types/booking.type';
import dayjs from '@app/lib/date-utils';
import { Form } from 'antd';

export const useUpdateBookingForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const updateBookingMutation = useUpdateBooking({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Booking updated successfully');
        setOpenFromModal(false);
        return;
      },
      onError: (error) => {
        showNotification('error', 'Failed to update booking', error.message);
      }
    }
  });

  const manageTicketsMutation = useManageTickets({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Booking and tickets updated successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Booking updated but failed to update tickets');
        setOpenFromModal(false);
      }
    }
  });

  const handleSubmit = async (id: number, tickets: TicketFormValues[]) => {
    try {
      const formValues = await form.validateFields();

      // Calculate total_amount from tickets
      const totalAmount = tickets.reduce((sum, ticket) => sum + (Number(ticket.price) || 0), 0);

      // Prepare booking data with total_amount
      const bookingData = {
        ...formValues,
        total_amount: totalAmount
      };

      // Step 1: Update booking
      await updateBookingMutation.mutateAsync({ id, ...bookingData });

      // Step 2: Update tickets
      await manageTicketsMutation.mutateAsync({
        bookingId: id,
        tickets
      });
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleSetFormValues = (values: Booking) => {
    setTimeout(() => {
      form.setFieldsValue({
        customer_id: values.customer_id,
        trip_id: values.trip_id,
        booking_time: values.booking_time ? dayjs(values.booking_time) : null,
        status: values.status
      });
    }, 0);
  };

  const getInitialTickets = (booking: Booking): TicketFormValues[] => {
    if (booking.tickets && booking.tickets.length > 0) {
      return booking.tickets.map((ticket) => ({
        seat_number: ticket.seat_number,
        price: ticket.price,
        qrcode: ticket.qrcode || ''
      }));
    }
    return [{ seat_number: '', price: 0, qrcode: '' }];
  };

  return {
    form,
    handleSubmit,
    isLoading: updateBookingMutation.isPending || manageTicketsMutation.isPending,
    handleSetFormValues,
    getInitialTickets
  };
};
