import { useNotification } from '@app/context/notification-context';
import { useCreateBooking } from '@app/features/booking/api/create-booking.api';
import { useManageTickets } from '@app/features/booking/api/manage-tickets.api';
import { TicketFormValues } from '@app/features/booking/types/booking.type';
import { Form } from 'antd';

export const useCreateBookingForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const createBookingMutation = useCreateBooking({
    mutationConfig: {
      onSuccess: (data) => {
        showNotification('success', 'Booking created successfully');
        setOpenFromModal(false);
        return data;
      },
      onError: (error) => {
        showNotification('error', 'Failed to create booking', error.message);
      }
    }
  });

  const manageTicketsMutation = useManageTickets({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Booking and tickets created successfully');
        setOpenFromModal(false);
        form.resetFields();
      },
      onError: () => {
        showNotification('error', 'Booking created but failed to create tickets');
        setOpenFromModal(false);
      }
    }
  });

  const handleSubmit = async (tickets: TicketFormValues[]) => {
    try {
      const formValues = await form.validateFields();

      // Calculate total_amount from tickets
      const totalAmount = tickets.reduce((sum, ticket) => sum + (Number(ticket.price) || 0), 0);

      // Prepare booking data with total_amount
      const bookingData = {
        ...formValues,
        total_amount: totalAmount
      };

      console.log('Creating booking with data:', bookingData); // Debug log

      // Step 1: Create booking
      const createdBooking = await createBookingMutation.mutateAsync(bookingData);

      if (createdBooking && createdBooking[0]) {
        const bookingId = createdBooking[0].id;

        // Step 2: Create tickets for this booking
        await manageTicketsMutation.mutateAsync({
          bookingId,
          tickets
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: createBookingMutation.isPending || manageTicketsMutation.isPending
  };
};
