import { useNotification } from '@app/context/notification-context';
import { useUpdateTrip } from '@app/features/trip-scheduling/api/update-trip.api';
import { Trip } from '@app/features/trip-scheduling/types/trip.type';
import { Form } from 'antd';
import dayjs from '@app/lib/date-utils';

export const useUpdateTripForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const updateTripMutation = useUpdateTrip({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Trip updated successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to update trip');
      }
    }
  });

  const handleSubmit = async (id: number) => {
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
        id,
        route_id: formValues.route_id,
        vehicle_id: formValues.vehicle_id,
        departure_time: departureDateTime,
        arrival_time: arrivalDateTime,
        status: formValues.status
      };

      updateTripMutation.mutate(payload);
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  };

  const handleSetFormValues = (values: Trip) => {
    setTimeout(() => {
      const departureTime = dayjs(values.departure_time);
      const arrivalTime = dayjs(values.arrival_time);

      form.setFieldsValue({
        route_id: values.route_id,
        vehicle_id: values.vehicle_id,
        departure_date: departureTime,
        departure_time: departureTime,
        arrival_date: arrivalTime,
        arrival_time: arrivalTime,
        status: values.status
      });
    }, 0);
  };

  return {
    form,
    handleSubmit,
    isLoading: updateTripMutation.isPending,
    handleSetFormValues
  };
};
