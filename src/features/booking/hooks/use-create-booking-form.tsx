import { useNotification } from '@app/context/notification-context';
import { useCreateBooking } from '@app/features/booking/api/create-booking.api';
import { Form } from 'antd';

export const useCreateBookingForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const createBookingMutation = useCreateBooking({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Booking created successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to create booking');
      }
    }
  });

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      createBookingMutation.mutate(formValues);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: createBookingMutation.isPending
  };
};
