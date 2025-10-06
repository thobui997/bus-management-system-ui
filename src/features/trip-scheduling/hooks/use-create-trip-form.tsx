import { useNotification } from '@app/context/notification-context';
import { useCreateTrip } from '@app/features/trip-scheduling/api/create-trip.api';
import { Form } from 'antd';
import dayjs from '@app/lib/date-utils';

export const useCreateTripForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const createTripMutation = useCreateTrip({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Trip created successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to create trip');
      }
    }
  });

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();

      // Combine date and time fields
      const departureDateTime = dayjs(formValues.departure_date)
        .hour(formValues.departure_time.hour())
        .minute(formValues.departure_time.minute())
        .second(0)
        .toISOString();

      const arrivalDateTime = dayjs(formValues.arrival_date)
        .hour(formValues.arrival_time.hour())
        .minute(formValues.arrival_time.minute())
        .second(0)
        .toISOString();

      const payload = {
        route_id: formValues.route_id,
        vehicle_id: formValues.vehicle_id,
        departure_time: departureDateTime,
        arrival_time: arrivalDateTime,
        status: formValues.status
      };

      createTripMutation.mutate(payload);
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: createTripMutation.isPending
  };
};
