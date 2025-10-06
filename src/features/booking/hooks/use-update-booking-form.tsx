import { useNotification } from '@app/context/notification-context';
import { useUpdateBooking } from '@app/features/booking/api/update-booking.api';
import { Booking } from '@app/features/booking/types/booking.type';
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
      },
      onError: () => {
        showNotification('error', 'Failed to update booking');
      }
    }
  });

  const handleSubmit = async (id: number) => {
    try {
      const formValues = await form.validateFields();
      updateBookingMutation.mutate({ id, ...formValues });
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
        total_amount: values.total_amount,
        status: values.status
      });
    }, 0);
  };

  return {
    form,
    handleSubmit,
    isLoading: updateBookingMutation.isPending,
    handleSetFormValues
  };
};
